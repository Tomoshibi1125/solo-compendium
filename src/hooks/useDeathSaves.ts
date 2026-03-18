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
import { isLocalCharacterId } from "@/lib/guestStore";
import { rollCheck } from "@/lib/rollEngine";

interface DeathSaveState {
	successes: number;
	failures: number;
	isStable: boolean;
	isDead: boolean;
}

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

const INITIAL_STATE: DeathSaveState = {
	successes: 0,
	failures: 0,
	isStable: false,
	isDead: false,
};

export function useDeathSaves(
	initialSuccesses = 0,
	initialFailures = 0,
): UseDeathSavesReturn {
	const [state, setState] = useState<DeathSaveState>({
		...INITIAL_STATE,
		successes: initialSuccesses,
		failures: initialFailures,
	});

	const rollDeathSave = useCallback((): DeathSaveRollResult => {
		const result = rollCheck(0, "normal");
		const roll = result.rolls[0] ?? 0;
		const isNat20 = roll === 20;
		const isNat1 = roll === 1;

		let newState: DeathSaveState;
		let message: string;
		let success: boolean;

		if (isNat20) {
			// Nat 20: regain 1 HP, reset death saves
			newState = { ...INITIAL_STATE };
			message = "Natural 20! You regain 1 HP and are conscious.";
			success = true;
		} else if (isNat1) {
			// Nat 1: 2 failures
			const newFailures = Math.min(3, state.failures + 2);
			const isDead = newFailures >= 3;
			newState = { ...state, failures: newFailures, isDead };
			message = isDead
				? "Natural 1! Two death save failures. You have died."
				: `Natural 1! Two failures (${newFailures}/3).`;
			success = false;
		} else if (roll >= 10) {
			// Success
			const newSuccesses = Math.min(3, state.successes + 1);
			const isStable = newSuccesses >= 3;
			newState = { ...state, successes: newSuccesses, isStable };
			message = isStable
				? `Success! You are stable (${newSuccesses}/3 successes).`
				: `Success (${newSuccesses}/3).`;
			success = true;
		} else {
			// Failure
			const newFailures = Math.min(3, state.failures + 1);
			const isDead = newFailures >= 3;
			newState = { ...state, failures: newFailures, isDead };
			message = isDead
				? `Failure. Three failures. You have died.`
				: `Failure (${newFailures}/3).`;
			success = false;
		}

		setState(newState);
		return { roll, isNat20, isNat1, success, newState, message };
	}, [state]);

	const takeDamageAtZero = useCallback(
		(damage: number, hpMax: number): DeathSaveState => {
			// Massive damage: instant death if damage >= hpMax
			if (damage >= hpMax) {
				const dead: DeathSaveState = {
					successes: 0,
					failures: 3,
					isStable: false,
					isDead: true,
				};
				setState(dead);
				return dead;
			}

			// Otherwise: 1 auto-failure per hit
			const newFailures = Math.min(3, state.failures + 1);
			const isDead = newFailures >= 3;
			const next: DeathSaveState = {
				...state,
				failures: newFailures,
				isDead,
				isStable: false,
			};
			setState(next);
			return next;
		},
		[state],
	);

	const receiveHealing = useCallback(() => {
		setState({ ...INITIAL_STATE });
	}, []);

	const stabilize = useCallback(() => {
		setState((prev) => ({ ...prev, isStable: true }));
	}, []);

	const reset = useCallback(() => {
		setState({ ...INITIAL_STATE });
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
				} as never)
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
