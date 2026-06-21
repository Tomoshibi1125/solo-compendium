/**
 * Misty Pearl B1 — Active Effects v2 runtime engine.
 *
 * Subscribes to the Bureau Directive Bus combat-lifecycle events
 * and decrements / clears each affected token's `effects` array via
 * the pure helpers in `@/lib/vtt/tokenEffects`. The host passes
 * `applyTokenEffects(tokenId, nextEffects)` which writes back
 * through `updateToken` (so the renderer + realtime layer pick it up
 * automatically).
 *
 * Hooks tapped:
 *   - `combat:turnEnd`  → tickRoundEffects on the actor whose turn ended
 *   - `combat:roundEnd` → tickMinuteEffects on every token (1 round ≈ 6 s,
 *                          we approximate as 1 minute every 10 rounds —
 *                          host can refine if needed)
 *   - `effect:applied` / `effect:expired` are emitted by this hook so
 *      downstream UIs (toasts, log) can react.
 */
import { useEffect, useRef } from "react";
import { hooks } from "@/lib/hooks/registry";
import {
	applyEffectLifecycle,
	type EffectLifecycleEvent,
} from "@/lib/vtt/tokenEffects";
import type { TokenEffect, VTTTokenInstance } from "@/types/vtt";

interface UseTokenEffectEngineOptions {
	enabled: boolean;
	tokens: VTTTokenInstance[];
	applyTokenEffects: (tokenId: string, effects: TokenEffect[]) => void;
}

export function useTokenEffectEngine(options: UseTokenEffectEngineOptions) {
	const { enabled, tokens, applyTokenEffects } = options;

	const tokensRef = useRef(tokens);
	useEffect(() => {
		tokensRef.current = tokens;
	}, [tokens]);
	const applyRef = useRef(applyTokenEffects);
	useEffect(() => {
		applyRef.current = applyTokenEffects;
	}, [applyTokenEffects]);
	const roundCounterRef = useRef(0);

	useEffect(() => {
		if (!enabled) return;

		const handleLifecycle = (
			tokenId: string | null,
			kind: EffectLifecycleEvent,
		) => {
			const list = tokensRef.current;
			for (const token of list) {
				if (tokenId && token.id !== tokenId) continue;
				if (!token.effects || token.effects.length === 0) continue;
				const before = token.effects;
				const after = applyEffectLifecycle(before, kind);
				if (after === before || after.length === before.length) {
					if (
						after.every(
							(eff, i) =>
								eff.durationValue === before[i]?.durationValue &&
								eff.id === before[i]?.id,
						)
					) {
						continue;
					}
				}
				applyRef.current(token.id, after);
				// Emit effect:expired for any effect dropped between before and after.
				for (const oldEffect of before) {
					if (!after.find((e) => e.id === oldEffect.id)) {
						hooks.emit("effect:expired", {
							tokenId: token.id,
							effectId: oldEffect.id,
							effectName: oldEffect.name,
						});
					}
				}
			}
		};

		const disposeTurnEnd = hooks.on("combat:turnEnd", (payload) => {
			handleLifecycle(payload.actorTokenId, "turn_end");
		});
		const disposeRoundEnd = hooks.on("combat:roundEnd", () => {
			roundCounterRef.current += 1;
			// Approximate minute-tick every 10 rounds (6s rounds → 1 minute).
			if (roundCounterRef.current >= 10) {
				roundCounterRef.current = 0;
				handleLifecycle(null, "minute_end");
			}
		});

		return () => {
			disposeTurnEnd();
			disposeRoundEnd();
		};
	}, [enabled]);
}
