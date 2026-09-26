/**
 * useUnifiedResources — one hook behind the auto-populated Resources section.
 *
 * Composes the three resource families (see lib/unifiedResources.ts):
 * job pools + custom rows live in character_sheet_state.resources
 * (DB-synced, guest-store aware, recharged by applyResourceRest on rests);
 * ammunition/consumables/charged items derive live from equipment rows and
 * write back through useEquipment, sharing the attack cards' write path.
 *
 * S3 also reconciles authoritative Sovereign v2 resource declarations into
 * the same custom-resource store. That deliberately reuses applyResourceRest,
 * so short/long-rest recovery has one implementation rather than a separate
 * Sovereign-only lifecycle.
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
	readAttachedSovereignV2,
	reconcileSovereignResourceRows,
	type SovereignResourceCost,
} from "@/lib/sovereign/sovereignRuntime";
import {
	applyJobPoolReconcile,
	characterRowToJobPoolShape,
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
	const sovereignDefinition = useMemo(
		() => readAttachedSovereignV2(character?.gemini_state),
		[character?.gemini_state],
	);

	// Re-run only when inputs that can change an auto-derived maximum change.
	// Resource spending itself must not trigger reconciliation/refills.
	const reconciledFor = useRef<string | null>(null);
	const reconcileSignature = character
		? `${characterId}:${character.level}:${sovereignDefinition?.id ?? "none"}`
		: null;

	useEffect(() => {
		if (!shouldReconcile || isLoading || !character || !reconcileSignature)
			return;
		if (reconciledFor.current === reconcileSignature) return;

		const migrated = migrateLocalTrackedResources(
			readLegacyRows(characterId),
			customResources,
		);
		const merged = [...customResources, ...migrated];

		const poolCharacter = characterRowToJobPoolShape(character);
		const jobReconcile = reconcileJobPools(
			character.job,
			poolCharacter,
			merged,
		);
		const afterJob = jobReconcile
			? applyJobPoolReconcile(merged, jobReconcile)
			: merged;
		const sovereignReconcile = reconcileSovereignResourceRows(
			afterJob,
			sovereignDefinition,
			character,
		);

		reconciledFor.current = reconcileSignature;

		if (
			migrated.length === 0 &&
			!jobReconcile &&
			!sovereignReconcile.changed
		)
			return;
		void saveSheetState({
			resources: {
				...resources,
				custom_resources: sovereignReconcile.rows,
			},
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
		sovereignDefinition,
		reconcileSignature,
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

	/** Spend one action's declared Sovereign resource costs in one state write. */
	const spendCustomCosts = useCallback(
		(costs: SovereignResourceCost[]): Promise<boolean> => {
			if (costs.length === 0) return Promise.resolve(true);
			const totals = new Map<string, number>();
			for (const cost of costs) {
				totals.set(cost.sourceKey, (totals.get(cost.sourceKey) ?? 0) + cost.amount);
			}
			for (const [sourceKey, amount] of totals) {
				const row = customResources.find((entry) => entry.sourceKey === sourceKey);
				if (!row || row.current < amount) return Promise.resolve(false);
			}
			const next = customResources.map((row) => {
				const amount = row.sourceKey ? totals.get(row.sourceKey) : undefined;
				return amount === undefined
					? row
					: { ...row, current: Math.max(0, row.current - amount) };
			});
			return saveCustomResources(next).then(() => true);
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
		allCustomResources: customResources,
		equipmentSections,
		autoSpendAmmo: resources.tracking.autoSpendAmmo,
		setAutoSpendAmmo,
		adjustCustom,
		spendCustomCosts,
		addCustom,
		removeCustom,
		adjustEquipment,
	};
}
