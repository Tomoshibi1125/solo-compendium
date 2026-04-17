/**
 * Resource & Ammunition Tracking System
 * Tracks consumable resources (arrows, bolts, reagents, charges, etc.)
 * with auto-decrement on use.
 *
 * TOGGLEABLE: Wardens can enable/disable resource tracking per character
 * via the `resourceTrackingEnabled` setting. When disabled, resources are
 * still stored but not auto-decremented or warned about.
 *
 * All functions are pure — callers provide state, functions return results.
 */

// ── Types ─────────────────────────────────────────────────────────────

export interface TrackedResource {
	/** Unique identifier */
	id: string;
	/** Display name (e.g. "Arrows", "Healing Potions", "Ki Points") */
	name: string;
	/** Resource category for grouping in UI */
	category: ResourceCategory;
	/** Current quantity */
	current: number;
	/** Maximum quantity (null = no limit, e.g. gold) */
	max: number | null;
	/** How this resource recovers */
	recovery: ResourceRecovery;
	/** Amount recovered per rest (null = full recovery) */
	recoveryAmount: number | null;
	/** Whether to warn when running low */
	warnAtLow: boolean;
	/** Threshold for "low" warning (e.g. 5 arrows remaining) */
	lowThreshold: number;
	/** Whether to auto-decrement when used in an action */
	autoDecrement: boolean;
	/** Linked equipment item ID (e.g., quiver for arrows) */
	linkedItemId?: string;
	/** Notes (e.g., "Purchased in Incheon Gate Market") */
	notes?: string;
}

export type ResourceCategory =
	| "ammunition" // Arrows, bolts, bullets, darts
	| "consumable" // Potions, scrolls, runes (one-time use)
	| "class-feature" // Ki Points, Rage uses, Channel Divinity
	| "spell-slot" // Managed by spellCasting.ts, shown here for reference
	| "rift-favor" // Managed separately but visible here
	| "custom"; // User-defined

export type ResourceRecovery =
	| "none" // Consumed permanently (potions, runes)
	| "short-rest" // Recovers on short rest (Ki, some features)
	| "long-rest" // Recovers on long rest (most features)
	| "manual" // Only recovered by manual action (buying arrows)
	| "dawn"; // Recovers at dawn (some magic items)

// ── Settings ──────────────────────────────────────────────────────────

export interface ResourceTrackingSettings {
	/** Master toggle — when false, no auto-decrements or warnings */
	enabled: boolean;
	/** Track ammunition (arrows, bolts, etc.) */
	trackAmmunition: boolean;
	/** Track consumables (potions, scrolls) */
	trackConsumables: boolean;
	/** Track class feature uses (Ki, Rage, etc.) */
	trackClassFeatures: boolean;
	/** Show warnings when resources are low */
	showLowWarnings: boolean;
}

/** Default settings — everything enabled */
export function getDefaultSettings(): ResourceTrackingSettings {
	return {
		enabled: true,
		trackAmmunition: true,
		trackConsumables: true,
		trackClassFeatures: true,
		showLowWarnings: true,
	};
}

// ── Resource State ────────────────────────────────────────────────────

export interface ResourceState {
	settings: ResourceTrackingSettings;
	resources: TrackedResource[];
}

export interface UseResourceResult {
	success: boolean;
	updatedResource: TrackedResource;
	message: string;
	warning?: string;
}

export interface RestRecoveryResult {
	recovered: Array<{ resource: TrackedResource; amountRecovered: number }>;
	unchanged: TrackedResource[];
}

// ── Core Functions ────────────────────────────────────────────────────

/** Create a new tracked resource with defaults */
export function createResource(
	partial: Partial<TrackedResource> & {
		name: string;
		category: ResourceCategory;
	},
): TrackedResource {
	return {
		id: crypto.randomUUID(),
		current: partial.max ?? 0,
		max: null,
		recovery: "none",
		recoveryAmount: null,
		warnAtLow: true,
		lowThreshold: 5,
		autoDecrement: true,
		...partial,
	};
}

/**
 * Use (decrement) a resource by a given amount.
 * Respects the settings toggle — if tracking is disabled, returns success
 * without decrementing.
 */
export function consumeResource(
	resource: TrackedResource,
	amount: number,
	settings: ResourceTrackingSettings,
): UseResourceResult {
	// Check if tracking is enabled for this category
	if (!isTrackingEnabled(resource.category, settings)) {
		return {
			success: true,
			updatedResource: resource,
			message: `${resource.name} used (tracking disabled).`,
		};
	}

	// Check if enough resources are available
	if (resource.current < amount) {
		return {
			success: false,
			updatedResource: resource,
			message: `Not enough ${resource.name}: ${resource.current} remaining, need ${amount}.`,
		};
	}

	const updated: TrackedResource = {
		...resource,
		current: resource.current - amount,
	};

	const result: UseResourceResult = {
		success: true,
		updatedResource: updated,
		message: `${resource.name}: ${resource.current} → ${updated.current}${resource.max !== null ? ` / ${resource.max}` : ""}`,
	};

	// Low warning check
	if (
		settings.showLowWarnings &&
		resource.warnAtLow &&
		updated.current <= resource.lowThreshold &&
		updated.current > 0
	) {
		result.warning = `⚠ Low ${resource.name}: only ${updated.current} remaining!`;
	}

	// Empty warning
	if (updated.current === 0) {
		result.warning = `⚠ ${resource.name} depleted!`;
	}

	return result;
}

/**
 * Add (increment) a resource by a given amount.
 * Used for purchasing, finding loot, etc.
 */
export function addResource(
	resource: TrackedResource,
	amount: number,
): TrackedResource {
	const newCurrent =
		resource.max !== null
			? Math.min(resource.current + amount, resource.max)
			: resource.current + amount;

	return { ...resource, current: newCurrent };
}

/**
 * Set a resource to a specific value.
 */
export function setResource(
	resource: TrackedResource,
	value: number,
): TrackedResource {
	const clamped =
		resource.max !== null
			? Math.min(Math.max(0, value), resource.max)
			: Math.max(0, value);

	return { ...resource, current: clamped };
}

// ── Rest Recovery ─────────────────────────────────────────────────────

/**
 * Recover resources based on rest type.
 * Called by restAutomation.ts after performing a rest.
 */
export function recoverResources(
	resources: TrackedResource[],
	restType: "short" | "long",
	settings: ResourceTrackingSettings,
): RestRecoveryResult {
	if (!settings.enabled) {
		return { recovered: [], unchanged: resources };
	}

	const recovered: Array<{
		resource: TrackedResource;
		amountRecovered: number;
	}> = [];
	const unchanged: TrackedResource[] = [];

	for (const resource of resources) {
		const shouldRecover =
			(restType === "short" && resource.recovery === "short-rest") ||
			(restType === "long" &&
				(resource.recovery === "short-rest" ||
					resource.recovery === "long-rest"));

		if (!shouldRecover || resource.max === null) {
			unchanged.push(resource);
			continue;
		}

		// Already at max
		if (resource.current >= resource.max) {
			unchanged.push(resource);
			continue;
		}

		const recoveryAmount = resource.recoveryAmount ?? resource.max;
		const newCurrent = Math.min(
			resource.current + recoveryAmount,
			resource.max,
		);
		const actualRecovery = newCurrent - resource.current;

		if (actualRecovery > 0) {
			recovered.push({
				resource: { ...resource, current: newCurrent },
				amountRecovered: actualRecovery,
			});
		} else {
			unchanged.push(resource);
		}
	}

	return { recovered, unchanged };
}

// ── Dawn Recovery ─────────────────────────────────────────────────────

/**
 * Recover resources that recharge at dawn (magic items, etc.).
 */
export function recoverDawnResources(
	resources: TrackedResource[],
): TrackedResource[] {
	return resources.map((resource) => {
		if (resource.recovery !== "dawn" || resource.max === null) {
			return resource;
		}

		const recoveryAmount = resource.recoveryAmount ?? resource.max;
		return {
			...resource,
			current: Math.min(resource.current + recoveryAmount, resource.max),
		};
	});
}

// ── Utility ───────────────────────────────────────────────────────────

/** Check if tracking is enabled for a specific resource category */
function isTrackingEnabled(
	category: ResourceCategory,
	settings: ResourceTrackingSettings,
): boolean {
	if (!settings.enabled) return false;

	switch (category) {
		case "ammunition":
			return settings.trackAmmunition;
		case "consumable":
			return settings.trackConsumables;
		case "class-feature":
			return settings.trackClassFeatures;
		default:
			return settings.enabled;
	}
}

/** Get all resources that are currently low or empty */
export function getLowResources(
	resources: TrackedResource[],
	settings: ResourceTrackingSettings,
): TrackedResource[] {
	if (!settings.enabled || !settings.showLowWarnings) return [];

	return resources.filter(
		(r) =>
			isTrackingEnabled(r.category, settings) &&
			r.warnAtLow &&
			r.current <= r.lowThreshold,
	);
}

/** Get a summary of all resources by category */
export function getResourceSummary(
	resources: TrackedResource[],
): Record<ResourceCategory, TrackedResource[]> {
	const summary: Record<ResourceCategory, TrackedResource[]> = {
		ammunition: [],
		consumable: [],
		"class-feature": [],
		"spell-slot": [],
		"rift-favor": [],
		custom: [],
	};

	for (const resource of resources) {
		summary[resource.category].push(resource);
	}

	return summary;
}

// ── Common Resource Templates ─────────────────────────────────────────

/** Quick-create common ammunition types */
export function createAmmunition(
	name: string,
	quantity: number,
): TrackedResource {
	return createResource({
		name,
		category: "ammunition",
		current: quantity,
		max: null,
		recovery: "manual",
		autoDecrement: true,
		warnAtLow: true,
		lowThreshold: 5,
	});
}

/** Quick-create a class feature resource */
export function createClassFeatureResource(
	name: string,
	maxUses: number,
	recovery: "short-rest" | "long-rest",
): TrackedResource {
	return createResource({
		name,
		category: "class-feature",
		current: maxUses,
		max: maxUses,
		recovery,
		autoDecrement: true,
		warnAtLow: true,
		lowThreshold: 1,
	});
}
