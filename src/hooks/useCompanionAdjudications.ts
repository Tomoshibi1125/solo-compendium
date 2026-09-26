import { useQuery } from "@tanstack/react-query";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";

export interface CompanionAttemptAdjudicationRow {
	id: string;
	campaign_id: string;
	character_id: string;
	companion_instance_id: string | null;
	target_source_id: string;
	attempt_kind: "tame" | "bond";
	roll_mode: "normal" | "advantage" | "disadvantage";
	proficiency_mode: "default" | "apply" | "suppress";
	specialization_mode: "default" | "apply" | "suppress";
	retry_of_attempt_id: string | null;
	reason: string | null;
	created_by_user_id: string;
	consumed_at: string | null;
	created_at: string;
}

export const COMPANION_ADJUDICATIONS_KEY = (campaignId: string) =>
	["companion-attempt-adjudications", campaignId] as const;

export function usePendingCompanionAdjudications(
	campaignId: string | undefined,
) {
	return useQuery({
		queryKey: COMPANION_ADJUDICATIONS_KEY(campaignId ?? ""),
		enabled: !!campaignId && isSupabaseConfigured,
		queryFn: async (): Promise<CompanionAttemptAdjudicationRow[]> => {
			if (!campaignId) return [];
			const { data, error } = await supabase
				.from("companion_attempt_adjudications" as never)
				.select("*")
				.eq("campaign_id", campaignId)
				.is("consumed_at", null)
				.order("created_at", { ascending: false });
			if (error) throw error;
			return (data ?? []) as unknown as CompanionAttemptAdjudicationRow[];
		},
	});
}
