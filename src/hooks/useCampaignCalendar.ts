/**
 * Misty Pearl H5 — Campaign calendar persistence hook.
 *
 * Stores the in-world clock under the existing `useCampaignToolState`
 * key so it round-trips through the always-on local mirror. Nothing
 * to add to the campaigns schema — the clock is small, JSON-shaped,
 * and entirely client-driven.
 */
import { useCallback } from "react";
import { useCampaignToolState } from "@/hooks/useToolState";
import {
	advanceClock,
	advanceRest,
	CAMPAIGN_CALENDAR_DEFAULTS,
	type CampaignClock,
	normalizeCampaignClock,
	resetRiftCycle,
	type RestKind,
} from "@/lib/campaignCalendar";

const STATE_KEY = "campaign_calendar_v1";

export function useCampaignCalendar(campaignId: string | null | undefined) {
	const { state: raw, setState: setRaw, isLoading } = useCampaignToolState<
		CampaignClock
	>(campaignId ?? null, STATE_KEY, {
		initialState: CAMPAIGN_CALENDAR_DEFAULTS,
	});

	const clock = normalizeCampaignClock(raw);

	const setClock = useCallback(
		(next: CampaignClock) => {
			setRaw(normalizeCampaignClock(next));
		},
		[setRaw],
	);

	const advanceHours = useCallback(
		(hours: number) => {
			setRaw(advanceClock(clock, { hours }));
		},
		[clock, setRaw],
	);

	const advanceMinutes = useCallback(
		(minutes: number) => {
			setRaw(advanceClock(clock, { minutes }));
		},
		[clock, setRaw],
	);

	const takeRest = useCallback(
		(kind: RestKind) => {
			setRaw(advanceRest(clock, kind));
		},
		[clock, setRaw],
	);

	const resetCycle = useCallback(() => {
		setRaw(resetRiftCycle(clock));
	}, [clock, setRaw]);

	return {
		clock,
		setClock,
		advanceHours,
		advanceMinutes,
		takeRest,
		resetCycle,
		isLoading,
	} as const;
}
