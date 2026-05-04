import { useCallback, useEffect, useState } from "react";
import {
	type ActionResolutionPayload,
	getPendingResolution,
	type ResolutionOutcome,
	resolveAttack,
	resolveDamage,
	resolveEffect,
	resolveHealing,
	resolveSave,
} from "@/lib/actionResolution";
import {
	applyDamageMitigation,
	type DamageMitigationProfile,
} from "@/lib/damageApplication";
import type { VTTTokenInstance } from "@/types/vtt";

type TargetProfile = DamageMitigationProfile & {
	armor_class?: number | null;
	hp_current?: number | null;
	hp_max?: number | null;
};

export type TargetedApplyResult = {
	targetId: string;
	tokenName: string;
	outcome: ResolutionOutcome;
	hpBefore?: number;
	hpAfter?: number;
	appliedAmount?: number;
};

type UseTargetedDamageApplyOptions = {
	selectedTargetIds: string[];
	tokens: VTTTokenInstance[];
	getCharacterForToken?: (token: VTTTokenInstance) => TargetProfile | null;
	updateToken: (tokenId: string, updates: Partial<VTTTokenInstance>) => void;
	syncCharacterHP?: (characterId: string | undefined, hp: number) => void;
	onApplied?: (
		results: TargetedApplyResult[],
		payload: ActionResolutionPayload,
	) => void;
};

const buildHpPatch = (
	token: VTTTokenInstance,
	nextHp: number,
): Partial<VTTTokenInstance> => {
	const patch: Partial<VTTTokenInstance> = {
		hp: nextHp,
		hp_current: nextHp,
	};
	if (Array.isArray(token.bars) && token.bars.length > 0) {
		const hpBarIndex = token.bars.findIndex((bar) => bar.id === "hp");
		if (hpBarIndex >= 0) {
			patch.bars = token.bars.map((bar, index) =>
				index === hpBarIndex ? { ...bar, current: nextHp } : bar,
			);
		}
	}
	return patch;
};

export function useTargetedDamageApply({
	selectedTargetIds,
	tokens,
	getCharacterForToken,
	updateToken,
	syncCharacterHP,
	onApplied,
}: UseTargetedDamageApplyOptions) {
	const [lastResults, setLastResults] = useState<TargetedApplyResult[]>([]);

	const applyPendingResolutionToTargets = useCallback(
		(payloadOverride?: ActionResolutionPayload | null) => {
			const payload = payloadOverride ?? getPendingResolution();
			if (!payload || selectedTargetIds.length === 0) {
				setLastResults([]);
				return [];
			}

			const targetIdSet = new Set(selectedTargetIds);
			const targetTokens = tokens.filter((token) => targetIdSet.has(token.id));
			const results: TargetedApplyResult[] = [];

			for (const token of targetTokens) {
				const profile = getCharacterForToken?.(token) ?? null;
				const targetAC =
					token.ac ?? token.armor_class ?? profile?.armor_class ?? 10;
				const outcome =
					payload.kind === "attack"
						? resolveAttack(payload, targetAC)
						: payload.kind === "save"
							? resolveSave(payload)
							: payload.kind === "healing"
								? resolveHealing(payload)
								: payload.kind === "effect"
									? resolveEffect(payload)
									: resolveDamage(payload);

				const currentHP =
					token.hp ?? token.hp_current ?? profile?.hp_current ?? 0;
				const maxHP =
					token.maxHp ?? token.hp_max ?? profile?.hp_max ?? currentHP;
				let hpAfter = currentHP;
				let appliedAmount: number | undefined;

				if (outcome.kind === "healing") {
					appliedAmount = outcome.healingTotal;
					hpAfter = Math.min(maxHP, currentHP + outcome.healingTotal);
					updateToken(token.id, buildHpPatch(token, hpAfter));
					syncCharacterHP?.(token.characterId, hpAfter);
				} else if (
					(outcome.kind === "attack" ||
						outcome.kind === "save" ||
						outcome.kind === "damage") &&
					outcome.damageTotal !== undefined
				) {
					const mitigated = applyDamageMitigation({
						rawDamage: outcome.damageTotal,
						damageType: payload.damage?.type,
						mitigation: profile,
						mode: "typed",
					});
					appliedAmount = mitigated.finalDamage;
					hpAfter = Math.max(0, currentHP - mitigated.finalDamage);
					updateToken(token.id, buildHpPatch(token, hpAfter));
					syncCharacterHP?.(token.characterId, hpAfter);
				} else if (
					outcome.kind === "effect" &&
					payload.appliesConditions?.length
				) {
					const nextConditions = Array.from(
						new Set([
							...(token.conditions ?? []),
							...payload.appliesConditions,
						]),
					);
					updateToken(token.id, { conditions: nextConditions });
				}

				results.push({
					targetId: token.id,
					tokenName: token.name,
					outcome,
					hpBefore: currentHP,
					hpAfter,
					appliedAmount,
				});
			}

			setLastResults(results);
			onApplied?.(results, payload);
			return results;
		},
		[
			getCharacterForToken,
			onApplied,
			selectedTargetIds,
			syncCharacterHP,
			tokens,
			updateToken,
		],
	);

	useEffect(() => {
		if (typeof window === "undefined") return;
		const handler = (event: Event) => {
			applyPendingResolutionToTargets(
				(event as CustomEvent<ActionResolutionPayload | undefined>).detail ??
					null,
			);
		};
		window.addEventListener("vtt:apply-pending-resolution-to-targets", handler);
		return () => {
			window.removeEventListener(
				"vtt:apply-pending-resolution-to-targets",
				handler,
			);
		};
	}, [applyPendingResolutionToTargets]);

	return { applyPendingResolutionToTargets, lastResults };
}
