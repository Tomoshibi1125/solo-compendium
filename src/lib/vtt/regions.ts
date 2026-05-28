/**
 * Misty Pearl A3 — Rift Regions (Foundry v14 Scene Regions parity).
 *
 * Pure module: point-in-polygon hit-testing + behavior evaluation for
 * Rift Regions. The host calls `evaluateRiftRegionEntry()` after a
 * token moves; the returned list of `RegionEffectEvent`s is consumed
 * by `useVTTRegionEngine` (separate hook) to dispatch damage /
 * conditions / Warden whispers / sound cues. This module never
 * mutates state and never calls the network.
 *
 * RA theming: regions are bounded Anomaly fields. Default presets:
 * "Mana Storm", "Void Bleed", "Sovereign Aura", "Sanctum Ward",
 * "Healing Spring".
 */
import robustPointInPolygon from "robust-point-in-polygon";
import type {
	VTTRegionBehavior,
	VTTRiftRegion,
} from "@/types/vtt";

/** Event emitted by a region's behavior. The host dispatches these. */
export type RegionEffectEvent =
	| {
			kind: "difficult_terrain";
			tokenId: string;
			regionId: string;
			multiplier: number;
	  }
	| {
			kind: "damage_on_enter";
			tokenId: string;
			regionId: string;
			dice: string;
			damageType: string;
	  }
	| {
			kind: "whisper_warden";
			tokenId: string;
			regionId: string;
			message: string;
	  }
	| {
			kind: "apply_condition";
			tokenId: string;
			regionId: string;
			condition: string;
	  }
	| {
			kind: "play_sound";
			tokenId: string;
			regionId: string;
			soundId: string;
	  };

/**
 * Point-in-polygon for a single point. Wraps `robust-point-in-polygon`
 * (a numerically stable winding-number test already in our deps).
 * Returns true when the point is *inside* the polygon (boundary inclusive).
 */
export function pointInRegion(
	point: { x: number; y: number },
	polygon: Array<{ x: number; y: number }>,
): boolean {
	if (!polygon || polygon.length < 3) return false;
	const vertices = polygon.map((p) => [p.x, p.y] as [number, number]);
	// Returns: -1 inside, 0 on edge, +1 outside.
	const result = robustPointInPolygon(vertices, [point.x, point.y]);
	return result <= 0;
}

/**
 * Walk every region on a scene and return the ones containing `point`.
 * Ignores regions with fewer than 3 polygon vertices.
 */
export function findContainingRegions(
	point: { x: number; y: number },
	regions: VTTRiftRegion[] | undefined,
): VTTRiftRegion[] {
	if (!regions || regions.length === 0) return [];
	const out: VTTRiftRegion[] = [];
	for (const region of regions) {
		if (pointInRegion(point, region.polygon)) {
			out.push(region);
		}
	}
	return out;
}

/**
 * Compare token's prior position against current and emit region
 * entry / exit events. Called by the host's `token_moved` realtime
 * handler.
 *
 * - **Entry**: token was OUTSIDE region last tick, now INSIDE → fire
 *   the region's `behaviors`.
 * - **Exit**: not currently emitted (Foundry v14 supports it; we
 *   defer until there's a use case).
 *
 * Returns a flat list of `RegionEffectEvent` the host can dispatch.
 */
export function evaluateRiftRegionEntry(args: {
	tokenId: string;
	prev: { x: number; y: number } | null;
	next: { x: number; y: number };
	regions: VTTRiftRegion[] | undefined;
}): RegionEffectEvent[] {
	const events: RegionEffectEvent[] = [];
	if (!args.regions || args.regions.length === 0) return events;

	for (const region of args.regions) {
		const inNow = pointInRegion(args.next, region.polygon);
		if (!inNow) continue;
		const wasIn = args.prev
			? pointInRegion(args.prev, region.polygon)
			: false;
		if (wasIn) continue; // not a fresh entry
		for (const behavior of region.behaviors) {
			const event = behaviorToEvent(args.tokenId, region.id, behavior);
			if (event) events.push(event);
		}
	}
	return events;
}

function behaviorToEvent(
	tokenId: string,
	regionId: string,
	behavior: VTTRegionBehavior,
): RegionEffectEvent | null {
	switch (behavior.kind) {
		case "difficult_terrain":
			return {
				kind: "difficult_terrain",
				tokenId,
				regionId,
				multiplier: behavior.multiplier,
			};
		case "damage_on_enter":
			return {
				kind: "damage_on_enter",
				tokenId,
				regionId,
				dice: behavior.dice,
				damageType: behavior.damageType,
			};
		case "whisper_warden":
			return {
				kind: "whisper_warden",
				tokenId,
				regionId,
				message: behavior.message,
			};
		case "apply_condition":
			return {
				kind: "apply_condition",
				tokenId,
				regionId,
				condition: behavior.condition,
			};
		case "play_sound":
			return {
				kind: "play_sound",
				tokenId,
				regionId,
				soundId: behavior.soundId,
			};
		default:
			return null;
	}
}

/**
 * Built-in region presets used by the Warden's authoring UI. Each is a
 * named bag of behaviors the Warden can drop onto a polygon and tweak.
 * RA canon names referenced from `docs/rift-ascendant-world-lore.md`.
 */
export const RIFT_REGION_PRESETS: ReadonlyArray<{
	id: string;
	name: string;
	color: string;
	opacity: number;
	behaviors: VTTRegionBehavior[];
}> = [
	{
		id: "preset-mana-storm",
		name: "Mana Storm",
		color: "#7c3aed",
		opacity: 0.35,
		behaviors: [
			{ kind: "damage_on_enter", dice: "1d6", damageType: "force" },
			{ kind: "play_sound", soundId: "mana-storm" },
		],
	},
	{
		id: "preset-void-bleed",
		name: "Void Bleed",
		color: "#1e1b4b",
		opacity: 0.55,
		behaviors: [
			{ kind: "damage_on_enter", dice: "2d6", damageType: "necrotic" },
			{ kind: "apply_condition", condition: "frightened" },
			{
				kind: "whisper_warden",
				message: "A token has entered the Void Bleed.",
			},
		],
	},
	{
		id: "preset-sovereign-aura",
		name: "Sovereign Aura",
		color: "#f59e0b",
		opacity: 0.3,
		behaviors: [
			{ kind: "apply_condition", condition: "charmed" },
			{
				kind: "whisper_warden",
				message: "Sovereign aura triggered. Apply CHA save.",
			},
		],
	},
	{
		id: "preset-sanctum-ward",
		name: "Sanctum Ward",
		color: "#10b981",
		opacity: 0.25,
		behaviors: [
			{ kind: "apply_condition", condition: "blessed" },
			{ kind: "play_sound", soundId: "sanctum-ward" },
		],
	},
	{
		id: "preset-healing-spring",
		name: "Healing Spring",
		color: "#34d399",
		opacity: 0.3,
		behaviors: [{ kind: "apply_condition", condition: "regeneration" }],
	},
	{
		id: "preset-difficult-terrain",
		name: "Difficult Terrain",
		color: "#92400e",
		opacity: 0.25,
		behaviors: [{ kind: "difficult_terrain", multiplier: 2 }],
	},
];
