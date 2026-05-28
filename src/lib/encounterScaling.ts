/**
 * Misty Pearl I5 — Live encounter difficulty scaling.
 *
 * Pure helpers that turn a combat snapshot into a difficulty signal
 * the Warden can act on between rounds. The downstream UI fires this
 * after each round-end, runs it through the AI policy (per memory
 * `41818241` — Pollinations / Gemini), and surfaces the recommendation
 * for **explicit Warden approval** before any combat-state mutation.
 *
 * Design contract: this module never mutates state and never calls the
 * network. It produces a typed `EncounterScalingSignal` that the UI +
 * AI layer reads. The actual model call lives in `useLiveEncounterScaler`
 * (separate hook) and remains opt-in per-campaign.
 *
 * RA theming: "Bureau Field Calibration" — the System adjusting the
 * trial's intensity without violating Warden authority.
 *
 * Pure module: no React, no Supabase, no DOM, no network.
 */

export type EncounterDifficultyBand = "trivial" | "easy" | "fair" | "hard" | "deadly";

export interface CombatantSnapshot {
	id: string;
	side: "party" | "enemy";
	hp: number;
	maxHp: number;
	/** Optional CR / rank weight; defaults to 1. */
	threat?: number;
	/** Whether the combatant is downed / dead (HP ≤ 0). Derived if omitted. */
	downed?: boolean;
}

export interface CombatRoundSnapshot {
	sessionId: string;
	round: number;
	combatants: CombatantSnapshot[];
}

export interface EncounterScalingSignal {
	/** Aggregate party-side health 0..1. */
	partyHealthRatio: number;
	/** Aggregate enemy-side health 0..1. */
	enemyHealthRatio: number;
	/** Combined CR-weighted threat ratio (enemy / party). */
	threatRatio: number;
	band: EncounterDifficultyBand;
	/** Suggested numeric scale to apply to remaining enemy HP / damage. 1 = no change. */
	suggestedScale: number;
	/** Human-readable recommendation for the Warden, RA-themed. */
	recommendation: string;
	/** Whether ANY action is recommended this round. */
	shouldRecommend: boolean;
}

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const safeRatio = (num: number, denom: number) =>
	denom <= 0 ? 0 : clamp01(num / denom);

/**
 * Pure analyzer: walks the combatants and computes party / enemy
 * health ratios + a CR-weighted threat ratio. No model calls; this is
 * the deterministic floor the UI can use even without AI.
 */
export function analyzeCombatRound(
	snapshot: CombatRoundSnapshot,
): EncounterScalingSignal {
	let partyHp = 0;
	let partyMax = 0;
	let enemyHp = 0;
	let enemyMax = 0;
	let partyThreat = 0;
	let enemyThreat = 0;

	for (const c of snapshot.combatants) {
		const hp = Math.max(0, c.hp);
		const maxHp = Math.max(1, c.maxHp || hp);
		const downed = c.downed ?? hp <= 0;
		const threat = Math.max(0, c.threat ?? 1);
		if (c.side === "party") {
			partyHp += hp;
			partyMax += maxHp;
			if (!downed) partyThreat += threat;
		} else {
			enemyHp += hp;
			enemyMax += maxHp;
			if (!downed) enemyThreat += threat;
		}
	}

	const partyHealthRatio = safeRatio(partyHp, partyMax);
	const enemyHealthRatio = safeRatio(enemyHp, enemyMax);
	const threatRatio =
		partyThreat <= 0 ? (enemyThreat > 0 ? 99 : 1) : enemyThreat / partyThreat;

	let band: EncounterDifficultyBand;
	if (partyHealthRatio < 0.25 && enemyHealthRatio > 0.6) band = "deadly";
	else if (partyHealthRatio < 0.5 && enemyHealthRatio > 0.7) band = "hard";
	else if (partyHealthRatio > 0.85 && enemyHealthRatio < 0.35) band = "trivial";
	else if (partyHealthRatio > 0.7 && enemyHealthRatio < 0.5) band = "easy";
	else band = "fair";

	let suggestedScale = 1;
	if (band === "deadly") suggestedScale = 0.7; // soften remaining HP
	else if (band === "hard") suggestedScale = 0.85;
	else if (band === "trivial") suggestedScale = 1.4; // beef up
	else if (band === "easy") suggestedScale = 1.15;

	const recommendation = buildRecommendation(
		band,
		partyHealthRatio,
		enemyHealthRatio,
	);

	return {
		partyHealthRatio,
		enemyHealthRatio,
		threatRatio,
		band,
		suggestedScale,
		recommendation,
		shouldRecommend: band !== "fair",
	};
}

function buildRecommendation(
	band: EncounterDifficultyBand,
	partyHp: number,
	enemyHp: number,
): string {
	const partyPct = Math.round(partyHp * 100);
	const enemyPct = Math.round(enemyHp * 100);
	switch (band) {
		case "deadly":
			return `Bureau Field Calibration: Party at ${partyPct}% with enemies still at ${enemyPct}%. Consider scaling remaining enemy HP to 0.7× or having a Rift surge interrupt the fight.`;
		case "hard":
			return `Bureau Field Calibration: Party at ${partyPct}%, enemies still at ${enemyPct}%. Slight scale-back (0.85×) keeps tension without TPK risk.`;
		case "easy":
			return `Bureau Field Calibration: Party at ${partyPct}%, enemies down to ${enemyPct}%. A reinforcement wave or environmental hazard would restore pressure.`;
		case "trivial":
			return `Bureau Field Calibration: Party barely scratched (${partyPct}%) and enemies nearly cleared (${enemyPct}%). Consider adding a Sovereign-tier reinforcement or skipping to narrative resolution.`;
		case "fair":
		default:
			return `Bureau Field Calibration: Encounter is tracking on-curve. No adjustment recommended.`;
	}
}
