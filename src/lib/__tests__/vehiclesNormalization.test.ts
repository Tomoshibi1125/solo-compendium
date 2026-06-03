/**
 * Vehicles & Mounts catalog normalization locks.
 *
 * The vehicles file mixes real-world mounts, bonded-anomaly mounts (thin
 * overlays via anomaly_id), net-new RA mounts, and vehicles (modern + rift-tech
 * + rare). This guards against id/name dupes and functional clones — two
 * vehicles with the same type, size, speed, AC, HP, and ability set would be
 * indistinguishable in play.
 */
import { describe, expect, it } from "vitest";
import { allVehicles } from "@/data/compendium/vehicles";

const stableStringify = (value: unknown): string => {
	if (value == null) return "";
	if (typeof value !== "object") return String(value).toLowerCase().trim();
	if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
	const entries = Object.entries(value as Record<string, unknown>).sort(
		([a], [b]) => a.localeCompare(b),
	);
	return `{${entries.map(([key, entry]) => `${key}:${stableStringify(entry)}`).join(",")}}`;
};

const fingerprint = (v: (typeof allVehicles)[number]): string =>
	stableStringify({
		vehicle_type: v.vehicle_type,
		size: v.size,
		speed: v.speed,
		armor_class: v.armor_class,
		hit_points: v.hit_points,
		abilities: v.abilities,
		bonded: v.bonded,
		anomaly_id: v.anomaly_id,
	});

describe("vehicles & mounts data normalization", () => {
	it("does not duplicate vehicle ids", () => {
		const ids = new Set<string>();
		for (const v of allVehicles) {
			expect(ids.has(v.id), `Duplicate vehicle id ${v.id}`).toBe(false);
			ids.add(v.id);
		}
	});

	it("does not duplicate vehicle names (case-insensitive)", () => {
		const names = new Set<string>();
		for (const v of allVehicles) {
			const key = v.name.toLowerCase();
			expect(names.has(key), `Duplicate vehicle name ${v.name}`).toBe(false);
			names.add(key);
		}
	});

	it("does not contain functionally identical vehicle clones", () => {
		const fingerprints = new Map<string, string[]>();
		for (const v of allVehicles) {
			const key = fingerprint(v);
			fingerprints.set(key, [...(fingerprints.get(key) ?? []), v.name]);
		}
		const duplicates = [...fingerprints.values()]
			.filter((names) => names.length > 1)
			.map((names) => names.join(" | "));
		expect(duplicates).toEqual([]);
	});

	it("vehicles with anomaly_id reference a real anomaly", async () => {
		const { anomalies } = await import("@/data/compendium/anomalies");
		const anomalyIds = new Set(anomalies.map((a) => a.id));
		const orphans = allVehicles
			.filter((v) => v.anomaly_id && !anomalyIds.has(v.anomaly_id))
			.map((v) => `${v.name} → ${v.anomaly_id}`);
		expect(orphans).toEqual([]);
	});
});
