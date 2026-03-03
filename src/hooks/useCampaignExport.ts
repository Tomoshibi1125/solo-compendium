import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { AppError } from "@/lib/appError";

const sanitizeBundle = (bundle: Json | null) => {
	if (!bundle || typeof bundle !== "object" || Array.isArray(bundle))
		return bundle;
	const sanitized = { ...(bundle as Record<string, Json>) };
	if (
		sanitized.campaign &&
		typeof sanitized.campaign === "object" &&
		!Array.isArray(sanitized.campaign)
	) {
		const campaign = { ...(sanitized.campaign as Record<string, Json>) };
		delete campaign.share_code;
		delete campaign.dm_id;
		sanitized.campaign = campaign;
	}
	if (Array.isArray(sanitized.invites)) {
		sanitized.invites = sanitized.invites.map((invite) => {
			if (!invite || typeof invite !== "object" || Array.isArray(invite))
				return invite;
			const safeInvite = { ...(invite as Record<string, Json>) };
			delete safeInvite.token;
			return safeInvite;
		}) as Json;
	}
	return sanitized;
};

const downloadJson = (payload: Json, filename: string) => {
	const blob = new Blob([JSON.stringify(payload, null, 2)], {
		type: "application/json",
	});
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	link.remove();
	URL.revokeObjectURL(url);
};

export const useCampaignExport = () => {
	const { toast } = useToast();

	return useMutation({
		mutationFn: async ({
			campaignId,
			filename,
		}: {
			campaignId: string;
			filename?: string;
		}) => {
			if (!isSupabaseConfigured) {
				throw new AppError("Supabase not configured", "CONFIG");
			}
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) throw new AppError("Not authenticated", "AUTH_REQUIRED");

			const { data, error } = await supabase.rpc("export_campaign_bundle", {
				p_campaign_id: campaignId,
			});
			if (error) throw error;
			const sanitized = sanitizeBundle(data as Json);
			downloadJson(
				sanitized ?? {},
				filename ?? `campaign-${campaignId}-export.json`,
			);
			return sanitized;
		},
		onSuccess: () => {
			toast({
				title: "Campaign exported",
				description: "Download started with secrets redacted.",
			});
		},
		onError: (error: Error) => {
			toast({
				title: "Export failed",
				description: error.message,
				variant: "destructive",
			});
		},
	});
};
