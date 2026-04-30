/**
 * Death Saving Throw Hook
 *
 * Bridges the pure-logic death save module to React state with Supabase persistence.
 *
 * D&D Beyond parity:
 *  - Tracks successes (0-3) and failures (0-3)
 *  - Natural 20: regain 1 HP, reset saves
 *  - Natural 1: 2 failures
 *  - Damage at 0 HP: auto-fail (massive damage = instant death)
 *  - Any healing at 0 HP: reset death saves
 *  - Stabilize at 3 successes
 */

import { useCallback, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
	applyDamageAtZero,
	applyDeathSaveRoll,
	applyHealingAtZero,
	applyReset,
	applyStabilize,
	type DeathSaveState,
	INITIAL_DEATH_SAVE_STATE,
} from "@/lib/deathSaveRules";
import { isLocalCharacterId } from "@/lib/guestStore";
import { rollCheck } from "@/lib/rollEngine";

interface DeathSaveRollResult {
	roll: number;
	isNat20: boolean;
	isNat1: boolean;
	success: boolean;
	newState: DeathSaveState;
	message: string;
}

interface UseDeathSavesReturn {
	state: DeathSaveState;
	/** Roll a death saving throw */
	rollDeathSave: () => DeathSaveRollResult;
	/** Take damage while at 0 HP */
	takeDamageAtZero: (damage: number, hpMax: number) => DeathSaveState;
	/** Receive healing while at 0 HP — resets saves */
	receiveHealing: () => void;
	/** Manually stabilize (e.g. Medicine check) */
	stabilize: () => void;
	/** Reset death saves (e.g. after regaining HP) */
	reset: () => void;
	/** Persist current state to Supabase */
	persist: (characterId: string) => Promise<void>;
}

export function useDeathSaves(
	initialSuccesses = 0,
	initialFailures = 0,
): UseDeathSavesReturn {
	const [state, setState] = useState<DeathSaveState>({
		...INITIAL_DEATH_SAVE_STATE,
		successes: initialSuccesses,
		failures: initialFailures,
	});

	const rollDeathSave = useCallback((): DeathSaveRollResult => {
		const result = rollCheck(0, "normal");
		const roll = result.rolls[0] ?? 0;
		const transition = applyDeathSaveRoll(state, roll);
		setState(transition.newState);
		return {
			roll,
			isNat20: transition.isNat20,
			isNat1: transition.isNat1,
			success: transition.success,
			newState: transition.newState,
			message: transition.message,
		};
	}, [state]);

	const takeDamageAtZero = useCallback(
		(damage: number, hpMax: number): DeathSaveState => {
			const next = applyDamageAtZero(state, damage, hpMax);
			setState(next);
			return next;
		},
		[state],
	);

	const receiveHealing = useCallback(() => {
		setState(applyHealingAtZero());
	}, []);

	const stabilize = useCallback(() => {
		setState((prev) => applyStabilize(prev));
	}, []);

	const reset = useCallback(() => {
		setState(applyReset());
	}, []);

	const persist = useCallback(
		async (characterId: string) => {
			if (isLocalCharacterId(characterId)) return;

			await supabase
				.from("characters")
				.update({
					death_save_successes: state.successes,
					death_save_failures: state.failures,
					stable: state.isStable,
				})
				.eq("id", characterId);
		},
		[state],
	);

	return {
		state,
		rollDeathSave,
		takeDamageAtZero,
		receiveHealing,
		stabilize,
		reset,
		persist,
	};
}
