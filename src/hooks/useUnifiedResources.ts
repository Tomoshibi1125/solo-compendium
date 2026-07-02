/**
 * useUnifiedResources — one hook behind the auto-populated Resources section.
 *
 * Composes the three resource families (see lib/unifiedResources.ts):
 * job pools + custom rows live in character_sheet_state.resources
 * (DB-synced, guest-store aware, recharged by applyResourceRest on rests);
 * ammunition/consumables/charged items derive live from equipment rows and
 * write back through useEquipment, sharing the attack cards' write path.
 *
 * On load it (once per character) migrates the retired localStorage tracker
 * (`sa-tracked-resources-*`) into custom_resources and reconciles job pools —
 * both idempotent, so repeat renders never write.
 */

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useCharacterSheetState } from "@/hooks/useCharacterSheetState";
import { useCharacter } from "@/hooks/useCharacters";
import { useEquipment } from "@/hooks/useEquipment";
import type {
	CustomResource,
	ResourceRecharge,
} from "@/lib/characterResources";
import {
	applyJobPoolReconcile,
	classifyEquipmentResources,
	type EquipmentResourceEntry,
	type LegacyTrackedResource,
	migrateLocalTrackedResources,
	reconcileJobPools,
} from "@/lib/unifiedResources";

const legacyStorageKey = (characterId: string) =>
	`sa-tracked-resources-${characterId}`;

function readLegacyRows(characterId: string): LegacyTrackedResource[] {
	try {
		const raw = window.localStorage.getItem(legacyStorageKey(characterId));
		if (!raw) return [];
		const parsed: unknown = JSON.parse(raw);
		return Array.isArray(parsed) ? (parsed as LegacyTrackedResource[]) : [];
	} catch {
		return [];
	}
}

export interface UseUnifiedResourcesOptions {
	/** Disable the auto-seed/migration writes (read-only shared sheets). */
	reconcile?: boolean;
}

export function useUnifiedResources(
	characterId: string,
	options?: UseUnifiedResourcesOptions,
) {
	const shouldReconcile = options?.reconcile ?? true;
	const { data: character } = useCharacter(characterId);
	const { equipment, updateEquipment } = useEquipment(characterId);
	const { state, isLoading, saveSheetState } =
		useCharacterSheetState(characterId);

	const resources = state.resources;
	const customResources = resources.custom_resources;

	// One reconcile pass per character per mount; the diff-null guards inside
	// make extra passes harmless, this just avoids write attempts on every
	// dependency wiggle.
	const reconciledFor = useRef<string | null>(null);

	useEffect(() => {
		if (!shouldReconcile || isLoading || !character) return;
		if (reconciledFor.current === characterId) return;

		const migrated = migrateLocalTrackedResources(
			readLegacyRows(characterId),
			customResources,
		);
		const merged = [...customResources, ...migrated];

		const poolCharacter = character as {
			level?: number | null;
			strength?: number | null;
			agility?: number | null;
			vitality?: number | null;
			presence?: number | null;
			intelligence?: number | null;
			sense?: number | null;
		};
		const reconcile = reconcileJobPools(character.job, poolCharacter, merged);

		reconciledFor.current = characterId;

		if (migrated.length === 0 && !reconcile) return;
		const next = reconcile ? applyJobPoolReconcile(merged, reconcile) : merged;
		void saveSheetState({
			resources: { ...resources, custom_resources: next },
		}).then(() => {
			try {
				window.localStorage.removeItem(legacyStorageKey(characterId));
			} catch {
				// ignore
			}
		});
	}, [
		shouldReconcile,
		isLoading,
		character,
		characterId,
		customResources,
		resources,
		saveSheetState,
	]);

	const equipmentSections = useMemo(() => {
		const entries = classifyEquipmentResources(equipment);
		return {
			ammunition: entries.filter((e) => e.kind === "ammunition"),
			consumables: entries.filter((e) => e.kind === "consumable"),
			charges: entries.filter((e) => e.kind === "charges"),
		};
	}, [equipment]);

	const jobPools = useMemo(
		() => customResources.filter((r) => r.origin === "job-pool"),
		[customResources],
	);
	const customRows = useMemo(
		() => customResources.filter((r) => r.origin !== "job-pool"),
		[customResources],
	);

	const saveCustomResources = useCallback(
		(next: CustomResource[]) =>
			saveSheetState({
				resources: { ...resources, custom_resources: next },
			}),
		[resources, saveSheetState],
	);

	const adjustCustom = useCallback(
		(id: string, delta: number) => {
			const next = customResources.map((row) => {
				if (row.id !== id) return row;
				const current = Math.max(0, Math.min(row.max, row.current + delta));
				return { ...row, current };
			});
			return saveCustomResources(next);
		},
		[customResources, saveCustomResources],
	);

	const addCustom = useCallback(
		(input: { name: string; max: number; recharge: ResourceRecharge }) => {
			const row: CustomResource = {
				id: crypto.randomUUID(),
				name: input.name.trim(),
				current: input.max,
				max: input.max,
				recharge: input.recharge,
				origin: "manual",
			};
			return saveCustomResources([...customResources, row]);
		},
		[customResources, saveCustomResources],
	);

	const removeCustom = useCallback(
		(id: string) =>
			saveCustomResources(customResources.filter((row) => row.id !== id)),
		[customResources, saveCustomResources],
	);

	const adjustEquipment = useCallback(
		(entry: EquipmentResourceEntry, delta: number) => {
			const cap = entry.max ?? Number.POSITIVE_INFINITY;
			const next = Math.max(0, Math.min(cap, entry.current + delta));
			if (next === entry.current) return Promise.resolve(null);
			return updateEquipment({
				id: entry.equipmentId,
				updates: { [entry.column]: next },
			});
		},
		[updateEquipment],
	);

	const setAutoSpendAmmo = useCallback(
		(autoSpendAmmo: boolean) =>
			saveSheetState({
				resources: { ...resources, tracking: { autoSpendAmmo } },
			}),
		[resources, saveSheetState],
	);

	return {
		isLoading,
		jobPools,
		customRows,
		equipmentSections,
		autoSpendAmmo: resources.tracking.autoSpendAmmo,
		setAutoSpendAmmo,
		adjustCustom,
		addCustom,
		removeCustom,
		adjustEquipment,
	};
}
