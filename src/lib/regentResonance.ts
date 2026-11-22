import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
	getLocalCharacterState,
	getLocalRegentResonance,
	isLocalCharacterId,
	refillLocalRegentResonance,
	spendLocalRegentResonance,
} from "@/lib/guestStore";
import { getRegentResonanceCost } from "@/lib/regentResonanceRules";

export interface RegentResonancePool {
	character_id: string;
	points_current: number;
	points_max: number;
}

const pendingSpends = new Map<string, string>();

/** A lost response retains its request key, so retrying cannot spend twice. */
export async function spendRegentResonance(
	characterId: string,
	kind: "power" | "technique",
	grantId: string,
	tier: number,
): Promise<number> {
	const cost = getRegentResonanceCost(tier);
	if (cost === null) throw new Error("This is not a tier 5–9 Regent ability.");
	if (isLocalCharacterId(characterId)) {
		return spendLocalRegentResonance(characterId, cost);
	}
	const key = `${characterId}:${kind}:${grantId}`;
	const requestId = pendingSpends.get(key) ?? crypto.randomUUID();
	pendingSpends.set(key, requestId);
	const { data, error } = await supabase.rpc("spend_regent_resonance", {
		p_character_id: characterId,
		p_grant_kind: kind,
		p_grant_id: grantId,
		p_request_id: requestId,
	});
	if (error) {
		// A server rejection is definitive; a network error leaves the same key
		// pending so the next attempt can safely discover a committed spend.
		if (error.code && error.code !== "PGRST301") pendingSpends.delete(key);
		throw error;
	}
	pendingSpends.delete(key);
	return data;
}

export async function refillRegentResonance(
	characterId: string,
): Promise<void> {
	if (isLocalCharacterId(characterId)) {
		refillLocalRegentResonance(characterId);
		return;
	}
	const { error } = await supabase.rpc("refill_regent_resonance", {
		p_character_id: characterId,
	});
	if (error) throw error;
}

export function useRegentResonance(characterId: string) {
	const queryClient = useQueryClient();
	const query = useQuery({
		queryKey: ["regent-resonance", characterId],
		enabled: !!characterId,
		queryFn: async (): Promise<RegentResonancePool | null> => {
			if (isLocalCharacterId(characterId)) {
				return getLocalRegentResonance(characterId);
			}
			const { data, error } = await supabase
				.from("character_regent_resonance")
				.select("character_id, points_current, points_max")
				.eq("character_id", characterId)
				.maybeSingle();
			if (error) throw error;
			return data;
		},
	});
	return {
		...query,
		refresh: () =>
			queryClient.invalidateQueries({
				queryKey: ["regent-resonance", characterId],
			}),
	};
}

export function usePendingRegentGrants(characterId: string) {
	return useQuery({
		queryKey: ["pending-regent-grants", characterId],
		enabled: !!characterId,
		queryFn: async (): Promise<
			Array<{
				id: string;
				canonical_id: string;
				regent_id: string;
				grant_kind: string;
			}>
		> => {
			if (isLocalCharacterId(characterId)) {
				return (
					getLocalCharacterState(characterId)?.pendingRegentGrants ?? []
				).map((row, index) => ({
					id: String(row.id ?? index),
					canonical_id: String(
						row.power_id ??
							row.technique_id ??
							row.canonical_id ??
							"unresolved",
					),
					regent_id: String(row.regent_id ?? "unresolved"),
					grant_kind: String(
						row.grant_kind ?? (row.power_id ? "power" : "technique"),
					),
				}));
			}
			const { data, error } = await supabase
				.from("character_pending_regent_grants")
				.select("id, canonical_id, regent_id, grant_kind")
				.eq("character_id", characterId)
				.eq("status", "pending");
			if (error) throw error;
			return data ?? [];
		},
	});
}
