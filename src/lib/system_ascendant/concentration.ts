/**
 * SRD 5e Concentration System
 * Manages concentration mechanics for spells and abilities
 */

export interface ConcentrationEffect {
	id: string;
	name: string;
	description: string;
	duration: number; // in rounds
	remainingRounds: number;
	concentrationDC?: number;
	breakOnDamage?: boolean;
}

export interface ConcentrationState {
	isConcentrating: boolean;
	currentEffect: ConcentrationEffect | null;
	concentrationCheckDC?: number;
	damageTakenThisRound: number;
}

// Initialize concentration state
export function initializeConcentration(): ConcentrationState {
	return {
		isConcentrating: false,
		currentEffect: null,
		damageTakenThisRound: 0,
	};
}

// Start concentrating on a spell or ability
export function startConcentration(
	state: ConcentrationState,
	effect: Omit<ConcentrationEffect, "remainingRounds">,
): ConcentrationState {
	return {
		...state,
		isConcentrating: true,
		currentEffect: {
			...effect,
			remainingRounds: effect.duration,
		},
		damageTakenThisRound: 0,
	};
}

/**
 * Compute the concentration save DC for a single damage instance.
 *
 * SRD 5e / DDB parity: DC = max(10, floor(damage / 2)) — per-hit, not
 * cumulative across the round. Damage of 0 still floors to 10 (the rule
 * only applies when concentration is active and damage was taken; the
 * caller is responsible for that gate).
 */
export function calculateConcentrationDC(damage: number): number {
	return Math.max(10, Math.floor(Math.max(0, damage) / 2));
}

// End concentration voluntarily
export function endConcentration(
	state: ConcentrationState,
): ConcentrationState {
	return {
		...state,
		isConcentrating: false,
		currentEffect: null,
		damageTakenThisRound: 0,
	};
}

// Get concentration status for display
export function getConcentrationStatus(state: ConcentrationState): {
	isConcentrating: boolean;
	effectName?: string;
	remainingRounds?: number;
	description?: string;
} {
	if (!state.isConcentrating || !state.currentEffect) {
		return {
			isConcentrating: false,
		};
	}

	return {
		isConcentrating: true,
		effectName: state.currentEffect.name,
		remainingRounds: state.currentEffect.remainingRounds,
		description: state.currentEffect.description,
	};
}
