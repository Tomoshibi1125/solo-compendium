/**
 * VTT Initiative auto-roll (P1-6)
 *
 * Pure helpers for rolling monster initiative when the tracker is opened.
 * Kept isolated from React/Supabase so it can be unit-tested in ~1 ms
 * with a mocked RNG.
 *
 * Rules (DDB Maps + Roll20 + Foundry parity):
 *   - Only rolls for non-hunter (monster / NPC) combatants.
 *   - By default, skips any combatant that already has a non-zero
 *     `initiative` so re-opening the tracker doesn't overwrite the
 *     Warden's manual entries. Pass `rerollAll: true` to force a
 *     re-roll across every monster.
 *   - Uses `combatant.dexMod ?? 0` as the d20 modifier.
 */

/**
 * Minimum subset of combatant fields the roller needs. Callers can pass
 * their richer `TrackerEntry` / `Combatant` shape directly — TS structural
 * typing will accept it.
 */
export interface InitiativeCandidate {
	id: string;
	isHunter: boolean;
	initiative: number;
	/** Agility modifier. Defaults to 0 when the combatant has no stat block. */
	dexMod?: number;
}

export interface InitiativeRoll {
	combatantId: string;
	/** The d20 face rolled (1–20 inclusive). */
	rolled: number;
	/** The Dex modifier applied. */
	modifier: number;
	/** `rolled + modifier`, which is what the UI should persist. */
	total: number;
}

export interface RollMonsterInitiativeOptions {
	/**
	 * Injectable RNG (0 ≤ x < 1). Defaults to `Math.random`. Tests swap
	 * this for a deterministic sequence so every assertion is stable.
	 */
	rng?: () => number;
	/**
	 * When `true`, re-roll every monster — even ones with initiative
	 * already set. When `false` (default), only fresh combatants
	 * (`initiative === 0`) are rolled.
	 */
	rerollAll?: boolean;
}

/**
 * Roll a d20 using the supplied RNG. Exported for tests that want to
 * verify the roll range independently of the full filter pipeline.
 */
export function rollD20(rng: () => number = Math.random): number {
	return Math.floor(rng() * 20) + 1;
}

/**
 * Returns one `InitiativeRoll` per monster that should be auto-rolled.
 * The return value is always a fresh array; combatants not rolled are
 * absent from the result (callers still need to preserve them in their
 * own scene/session state).
 */
export function rollMonsterInitiative(
	combatants: InitiativeCandidate[],
	options: RollMonsterInitiativeOptions = {},
): InitiativeRoll[] {
	const rng = options.rng ?? Math.random;
	const rerollAll = options.rerollAll ?? false;

	const rolls: InitiativeRoll[] = [];
	for (const combatant of combatants) {
		if (combatant.isHunter) continue;
		if (!rerollAll && combatant.initiative !== 0) continue;
		const rolled = rollD20(rng);
		const modifier = combatant.dexMod ?? 0;
		rolls.push({
			combatantId: combatant.id,
			rolled,
			modifier,
			total: rolled + modifier,
		});
	}
	return rolls;
}
