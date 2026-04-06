/**
 * Hit Dice Spending Hook (Short Rest)
 *
 * D&D Beyond parity: during a short rest, a player can spend hit dice
 * to recover HP. Each hit die rolled = 1dX + VIT modifier.
 *
 * Rules:
 *  - Can spend up to current hit dice available
 *  - Each die: roll hit die size + VIT modifier (minimum 0 HP per die)
 *  - HP cannot exceed max
 *  - Hit dice recover on long rest (half of max, rounded up, minimum 1)
 */

import { useCallback, useMemo, useState } from "react";
import { getAbilityModifier } from "@/types/core-rules";

interface HitDieRollResult {
	roll: number;
	vitModifier: number;
	hpRecovered: number;
	hitDiceRemaining: number;
}

interface UseHitDiceSpendingReturn {
	/** Number of hit dice currently available */
	hitDiceAvailable: number;
	/** Total HP recovered this short rest session */
	totalHPRecovered: number;
	/** Individual roll results */
	rolls: HitDieRollResult[];
	/** Spend one hit die */
	spendHitDie: () => HitDieRollResult | null;
	/** Reset for a new short rest session */
	resetSession: () => void;
	/** Calculate how many hit dice recover on long rest */
	longRestRecovery: number;
}

export function useHitDiceSpending(
	hitDiceCurrent: number,
	hitDiceMax: number,
	hitDieSize: number,
	vitScore: number,
	hpCurrent: number,
	hpMax: number,
): UseHitDiceSpendingReturn {
	const [available, setAvailable] = useState(hitDiceCurrent);
	const [totalRecovered, setTotalRecovered] = useState(0);
	const [rolls, setRolls] = useState<HitDieRollResult[]>([]);

	const vitMod = useMemo(() => getAbilityModifier(vitScore), [vitScore]);

	const spendHitDie = useCallback((): HitDieRollResult | null => {
		if (available <= 0) return null;

		const currentHP = hpCurrent + totalRecovered;
		if (currentHP >= hpMax) return null;

		const roll = Math.floor(Math.random() * hitDieSize) + 1;
		const hpGain = Math.max(0, roll + vitMod);
		const actualGain = Math.min(hpGain, hpMax - currentHP);

		const result: HitDieRollResult = {
			roll,
			vitModifier: vitMod,
			hpRecovered: actualGain,
			hitDiceRemaining: available - 1,
		};

		setAvailable((prev) => prev - 1);
		setTotalRecovered((prev) => prev + actualGain);
		setRolls((prev) => [...prev, result]);

		return result;
	}, [available, hitDieSize, vitMod, hpCurrent, hpMax, totalRecovered]);

	const resetSession = useCallback(() => {
		setTotalRecovered(0);
		setRolls([]);
	}, []);

	const longRestRecovery = useMemo(
		() => Math.max(1, Math.ceil(hitDiceMax / 2)),
		[hitDiceMax],
	);

	return {
		hitDiceAvailable: available,
		totalHPRecovered: totalRecovered,
		rolls,
		spendHitDie,
		resetSession,
		longRestRecovery,
	};
}
