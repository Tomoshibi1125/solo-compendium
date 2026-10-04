/**
 * Misty Pearl I5 — Live encounter difficulty scaler.
 *
 * React wrapper around the pure `analyzeCombatRound` analyzer in
 * `@/lib/encounterScaling`. Computes a deterministic signal
 * synchronously and makes no AI or network call (RA-18). Mutations on
 * combat state stay manual — the Warden must approve every adjustment.
 *
 * RA theming: "Bureau Field Calibration".
 */
import { useCallback, useState } from "react";
import {
	analyzeCombatRound,
	type CombatRoundSnapshot,
	type EncounterScalingSignal,
} from "@/lib/encounterScaling";

export interface UseLiveEncounterScalerResult {
	signal: EncounterScalingSignal | null;
	analyze: (snapshot: CombatRoundSnapshot) => EncounterScalingSignal;
	clear: () => void;
}

export function useLiveEncounterScaler(): UseLiveEncounterScalerResult {
	const [signal, setSignal] = useState<EncounterScalingSignal | null>(null);

	const analyze = useCallback((snapshot: CombatRoundSnapshot) => {
		const next = analyzeCombatRound(snapshot);
		setSignal(next);
		return next;
	}, []);

	const clear = useCallback(() => setSignal(null), []);

	return { signal, analyze, clear };
}
