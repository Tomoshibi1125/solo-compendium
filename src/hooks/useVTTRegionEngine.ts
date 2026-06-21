/**
 * Misty Pearl A3 — Rift Region runtime engine.
 *
 * Subscribes to the Bureau Directive Bus (G1) `token:moved` event,
 * walks the active scene's regions, and dispatches
 * `RegionEffectEvent`s to the host (chat / damage application /
 * sound / condition). Pure-helper-driven — all logic lives in
 * `@/lib/vtt/regions`; this hook is only wiring + lifecycle.
 *
 * RA theming: regions are "Anomaly fields" — bounded zones whose
 * behaviors fire when an Ascendant or Anomaly enters them.
 */
import { useEffect, useRef } from "react";
import { hooks } from "@/lib/hooks/registry";
import {
	evaluateRiftRegionEntry,
	type RegionEffectEvent,
} from "@/lib/vtt/regions";
import type { VTTRiftRegion, VTTTokenInstance } from "@/types/vtt";

interface UseVTTRegionEngineOptions {
	enabled: boolean;
	tokens: VTTTokenInstance[];
	regions: VTTRiftRegion[] | undefined;
	onEvent: (event: RegionEffectEvent) => void;
}

export function useVTTRegionEngine(options: UseVTTRegionEngineOptions) {
	const { enabled, tokens, regions, onEvent } = options;

	// Last-known position per token so we can compute "fresh entry".
	const lastPosRef = useRef<Map<string, { x: number; y: number }>>(new Map());
	// Hold the latest onEvent ref so the subscription doesn't churn.
	const onEventRef = useRef(onEvent);
	useEffect(() => {
		onEventRef.current = onEvent;
	}, [onEvent]);
	const regionsRef = useRef(regions);
	useEffect(() => {
		regionsRef.current = regions;
	}, [regions]);
	const tokensRef = useRef(tokens);
	useEffect(() => {
		tokensRef.current = tokens;
		// Reset stale positions whenever the token set shrinks.
		const live = new Set(tokens.map((t) => t.id));
		for (const id of lastPosRef.current.keys()) {
			if (!live.has(id)) lastPosRef.current.delete(id);
		}
	}, [tokens]);

	useEffect(() => {
		if (!enabled) return;
		const dispose = hooks.on("token:moved", (payload) => {
			const tokens = tokensRef.current;
			const token = tokens.find((t) => t.id === payload.tokenId);
			if (!token) return;
			const prev =
				payload.from ?? lastPosRef.current.get(payload.tokenId) ?? null;
			const events = evaluateRiftRegionEntry({
				tokenId: payload.tokenId,
				prev,
				next: payload.to,
				regions: regionsRef.current,
			});
			lastPosRef.current.set(payload.tokenId, payload.to);
			for (const event of events) {
				onEventRef.current(event);
			}
		});
		return dispose;
	}, [enabled]);
}
