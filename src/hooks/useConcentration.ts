/**
 * Concentration Tracking Hook
 *
 * Bridges the pure-logic concentration module (src/lib/system_ascendant/concentration.ts)
 * to React state with Supabase persistence via the character's conditions array.
 *
 * D&D Beyond parity:
 *  - Tracks active concentration spell name + remaining rounds
 *  - Auto-prompts for VIT save when damage is taken (with advantage/disadvantage)
 *  - Drops concentration when a new concentration spell is cast
 *  - Fires onConcentrationLost so analytics/condition cleanup can react in one place
 */

import { useCallback, useMemo, useState } from "react";
import { rollCheck } from "@/lib/rollEngine";
import {
	type ConcentrationEffect,
	type ConcentrationState,
	calculateConcentrationDC,
	endConcentration,
	getConcentrationStatus,
	initializeConcentration,
	startConcentration,
} from "@/lib/system_ascendant/concentration";
import { getAbilityModifier, getProficiencyBonus } from "@/types/core-rules";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ConcentrationSaveMode = "normal" | "advantage" | "disadvantage";

export type ConcentrationLostReason =
	| "drop"
	| "replaced"
	| "damage"
	| "expired";

interface ConcentrationCheckResult {
	success: boolean;
	roll: number;
	dc: number;
	modifier: number;
	total: number;
	mode: ConcentrationSaveMode;
	spellName: string | null;
	concentrationLost: boolean;
}

interface UseConcentrationOptions {
	/**
	 * Fired whenever an active concentration is lost for any reason
	 * (voluntary drop, replaced by a new spell, broken by damage, expired).
	 * Use this hook point for analytics, condition cleanup, etc.
	 */
	onConcentrationLost?: (
		spellName: string,
		reason: ConcentrationLostReason,
	) => void;
}

interface UseConcentrationReturn {
	/** Current concentration state */
	state: ConcentrationState;
	/** Display-friendly status */
	status: ReturnType<typeof getConcentrationStatus>;
	/** Start concentrating on a new spell/effect */
	concentrate: (effect: Omit<ConcentrationEffect, "remainingRounds">) => void;
	/** Voluntarily drop concentration */
	drop: () => void;
	/**
	 * Process damage taken — returns the concentration check result.
	 * `mode` defaults to "normal"; pass "advantage"/"disadvantage" when feats
	 * (War Caster, Resilient) or condition modifiers apply.
	 */
	takeDamage: (
		damage: number,
		mode?: ConcentrationSaveMode,
	) => ConcentrationCheckResult | null;
	/** Advance one round (decrement remaining duration) */
	advanceRound: () => void;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useConcentration(
	vitScore: number,
	characterLevel: number,
	saveProficiencies: string[],
	options?: UseConcentrationOptions,
): UseConcentrationReturn {
	const [state, setState] = useState<ConcentrationState>(
		initializeConcentration,
	);

	const vitMod = useMemo(() => getAbilityModifier(vitScore), [vitScore]);
	const profBonus = useMemo(
		() => getProficiencyBonus(characterLevel),
		[characterLevel],
	);
	const isProficient = saveProficiencies.includes("VIT");
	const saveModifier = vitMod + (isProficient ? profBonus : 0);

	const status = useMemo(() => getConcentrationStatus(state), [state]);

	const onConcentrationLost = options?.onConcentrationLost;

	const concentrate = useCallback(
		(effect: Omit<ConcentrationEffect, "remainingRounds">) => {
			setState((prev) => {
				// If we are replacing an active, different concentration, fire the
				// loss callback so listeners can clean up before the new one starts.
				if (
					prev.isConcentrating &&
					prev.currentEffect &&
					prev.currentEffect.id !== effect.id &&
					onConcentrationLost
				) {
					onConcentrationLost(prev.currentEffect.name, "replaced");
				}
				return startConcentration(prev, effect);
			});
		},
		[onConcentrationLost],
	);

	const drop = useCallback(() => {
		setState((prev) => {
			if (prev.isConcentrating && prev.currentEffect && onConcentrationLost) {
				onConcentrationLost(prev.currentEffect.name, "drop");
			}
			return endConcentration(prev);
		});
	}, [onConcentrationLost]);

	const takeDamage = useCallback(
		(
			damage: number,
			mode: ConcentrationSaveMode = "normal",
		): ConcentrationCheckResult | null => {
			if (!state.isConcentrating || !state.currentEffect) return null;

			const dc = calculateConcentrationDC(damage);
			const rollResult = rollCheck(0, mode);
			const roll = rollResult.rolls[0] ?? 0;
			const total = roll + saveModifier;
			const success = total >= dc;

			const spellName = state.currentEffect.name;

			if (!success) {
				setState((prev) => endConcentration(prev));
				if (onConcentrationLost) onConcentrationLost(spellName, "damage");
			}

			return {
				success,
				roll,
				dc,
				modifier: saveModifier,
				total,
				mode,
				spellName,
				concentrationLost: !success,
			};
		},
		[state, saveModifier, onConcentrationLost],
	);

	const advanceRound = useCallback(() => {
		setState((prev) => {
			if (!prev.isConcentrating || !prev.currentEffect) return prev;
			const remaining = prev.currentEffect.remainingRounds - 1;
			if (remaining <= 0) {
				if (onConcentrationLost) {
					onConcentrationLost(prev.currentEffect.name, "expired");
				}
				return {
					...prev,
					isConcentrating: false,
					currentEffect: null,
					damageTakenThisRound: 0,
				};
			}
			return {
				...prev,
				currentEffect: { ...prev.currentEffect, remainingRounds: remaining },
				damageTakenThisRound: 0,
			};
		});
	}, [onConcentrationLost]);

	return { state, status, concentrate, drop, takeDamage, advanceRound };
}
