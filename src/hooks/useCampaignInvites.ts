import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { AppError } from "@/lib/appError";
import {
	deriveCampaignInviteStatus,
	normalizeInviteAccessKey,
} from "@/lib/campaignInviteUtils";

const guestEnabled = import.meta.env.VITE_GUEST_ENABLED !== "false";

export interface CampaignInviteRecord {
	id: string;
	campaign_id: string;
	token: string;
	role: "ascendant" | "co-system";
	expires_at: string | null;
	max_uses: number;
	used_count: number;
	created_at: string;
	created_by: string | null;
	updated_at: string;
	last_used_at: string | null;
	join_code: string | null;
	invite_email: string | null;
	revoked_at: string | null;
	revoked_by: string | null;
	revoked_reason: string | null;
	metadata: Json;
	status?: "active" | "expired" | "revoked" | "used_up" | "unknown";
}

export interface CampaignInviteSummary {
	campaign_id: string;
	campaign_name: string;
	campaign_description: string | null;
	role: "ascendant" | "co-system";
	expires_at: string | null;
	max_uses: number;
	used_count: number;
	join_code: string | null;
	invite_email: string | null;
	status?: "active" | "expired" | "revoked" | "used_up" | "unknown";
}

export interface CampaignInviteCreateResult {
	id: string;
	token: string;
	join_code?: string | null;
	invite_url?: string | null;
	role: "ascendant" | "co-system";
	expires_at: string | null;
	max_uses: number;
	used_count: number;
	revoked_at: string | null;
	invite_email: string | null;
	email_delivery?: {
		attempted: boolean;
		sent: boolean;
		error: string | null;
	};
}

const supabaseAny = supabase as unknown as {
	rpc: (
		fn: string,
		args?: Record<string, unknown>,
	) => Promise<{ data: unknown; error: Error | null }>;
	from: (table: string) => {
		select: (columns?: string) => {
			eq: (
				column: string,
				value: string,
			) => {
				order: (
					column: string,
					opts?: { ascending?: boolean },
				) => {
					limit: (
						count: number,
					) => Promise<{ data: unknown[] | null; error: Error | null }>;
				};
			};
		};
	};
};

export interface CampaignInviteAuditLog {
	id: string;
	campaign_id: string;
	invite_id: string | null;
	actor_id: string | null;
	action: string;
	details: Json;
	created_at: string;
}

type CreateInviteArgs = {
	campaignId: string;
	role?: "ascendant" | "co-system";
	expiresAt?: string | null;
	maxUses?: number;
	inviteEmail?: string;
};

const normalizeInviteRecord = (
	invite: CampaignInviteRecord,
): CampaignInviteRecord => {
	const status = deriveCampaignInviteStatus(invite);
	return {
		...invite,
		status,
	};
};

const shouldFallbackToLegacyInviteRpc = (error: unknown): boolean => {
	if (!error || typeof error !== "object") return false;
	const message = String(
		(error as { message?: unknown }).message ?? "",
	).toLowerCase();
	return (
		message.includes("function") &&
		message.includes("create_campaign_invite") &&
		(message.includes("does not exist") ||
			message.includes("no function matches") ||
			message.includes("could not find function") ||
			message.includes("schema cache"))
	);
};

const shouldFallbackToLegacyRevokeRpc = (error: unknown): boolean => {
	if (!error || typeof error !== "object") return false;
	const message = String(
		(error as { message?: unknown }).message ?? "",
	).toLowerCase();
	return (
		message.includes("revoke_campaign_invite") &&
		(message.includes("does not exist") ||
			message.includes("no function matches") ||
			message.includes("could not find function") ||
			message.includes("schema cache"))
	);
};

const createInviteViaApi = async ({
	campaignId,
	role = "ascendant",
	expiresAt,
	maxUses = 1,
	inviteEmail,
}: CreateInviteArgs): Promise<CampaignInviteCreateResult> => {
	const accessToken = (await supabase.auth.getSession()).data.session
		?.access_token;
	if (!accessToken) {
		throw new AppError("Not authenticated", "AUTH_REQUIRED");
	}

	const response = await fetch("/api/createInvite", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
		body: JSON.stringify({
			campaignId,
			role,
			expiresAt,
			maxUses,
			inviteEmail,
		}),
	});

	if (!response.ok) {
		const payload = (await response.json().catch(() => ({}))) as {
			error?: string;
		};
		throw new AppError(
			payload.error || "Failed to create invite via API",
			"UNKNOWN",
		);
	}

	const payload = (await response.json()) as {
		invite: CampaignInviteCreateResult;
		emailDelivery?: CampaignInviteCreateResult["email_delivery"];
	};

	return {
		...payload.invite,
		email_delivery: payload.emailDelivery,
	};
};

export const useCampaignInvites = (campaignId: string) => {
	return useQuery({
		queryKey: ["campaigns", campaignId, "invites"],
		queryFn: async (): Promise<CampaignInviteRecord[]> => {
			if (!isSupabaseConfigured) return [];
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) {
				if (guestEnabled) return [];
				throw new AppError("Not authenticated", "AUTH_REQUIRED");
			}

			const { data, error } = await supabase
				.from("campaign_invites")
				.select("*")
				.eq("campaign_id", campaignId)
				.order("created_at", { ascending: false });

			if (error) throw error;
			const invites = ((data || []) as unknown as CampaignInviteRecord[]).map(
				normalizeInviteRecord,
			);
			return invites;
		},
		enabled: !!campaignId,
	});
};

export const useCreateCampaignInvite = () => {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async ({
			campaignId,
			role = "ascendant",
			expiresAt,
			maxUses = 1,
			inviteEmail,
		}: CreateInviteArgs) => {
			if (!isSupabaseConfigured) {
				throw new AppError("Supabase not configured", "CONFIG");
			}

			const normalizedInviteEmail =
				inviteEmail?.trim().toLowerCase() || undefined;

			if (normalizedInviteEmail) {
				try {
					return await createInviteViaApi({
						campaignId,
						role,
						expiresAt,
						maxUses,
						inviteEmail: normalizedInviteEmail,
					});
				} catch {
					// Fallback to direct RPC in local/dev if API endpoint is unavailable.
				}
			}

			let { data, error } = await supabaseAny.rpc("create_campaign_invite", {
				p_campaign_id: campaignId,
				p_role: role,
				p_expires_at: expiresAt ?? undefined,
				p_max_uses: maxUses,
				p_invite_email: normalizedInviteEmail,
			});

			if (error && shouldFallbackToLegacyInviteRpc(error)) {
				const legacyResult = await supabaseAny.rpc("create_campaign_invite", {
					p_campaign_id: campaignId,
					p_role: role,
					p_expires_at: expiresAt ?? undefined,
					p_max_uses: maxUses,
				});
				data = legacyResult.data;
				error = legacyResult.error;
			}

			if (error) throw error;
			const invite = Array.isArray(data) ? data[0] : data;
			if (!invite) throw new AppError("Failed to create invite", "UNKNOWN");
			return invite as CampaignInviteCreateResult;
		},
		onSuccess: (invite, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["campaigns", variables.campaignId, "invites"],
			});
			queryClient.invalidateQueries({
				queryKey: ["campaigns", variables.campaignId, "invite-audit"],
			});
			toast({
				title: "Invite created",
				description: invite.email_delivery?.attempted
					? invite.email_delivery.sent
						? "Invite link generated and email invite sent."
						: "Invite link generated. Email delivery failed, so share the link manually."
					: "Share the invite link with the next Ascendant.",
			});
		},
		onError: (error: Error) => {
			toast({
				title: "Failed to create invite",
				description: error.message,
				variant: "destructive",
			});
		},
	});
};

export const useAddPlayerCharacterToCampaign = () => {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async ({
			campaignId,
			characterId,
			inviteToken,
		}: {
			campaignId: string;
			characterId: string;
			inviteToken?: string;
		}) => {
			if (!isSupabaseConfigured) {
				throw new AppError("Supabase not configured", "CONFIG");
			}

			const { data, error } = await supabaseAny.rpc(
				"add_player_character_to_campaign",
				{
					p_campaign_id: campaignId,
					p_character_id: characterId,
					p_invite_token: inviteToken ?? undefined,
				},
			);

			if (error) throw error;
			return data as string;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ["campaigns"] });
			queryClient.invalidateQueries({
				queryKey: ["campaigns", variables.campaignId, "members"],
			});
			toast({
				title: "Character attached",
				description: "Your Ascendant is now attached to this campaign.",
			});
		},
		onError: (error: Error) => {
			toast({
				title: "Failed to attach character",
				description: error.message,
				variant: "destructive",
			});
		},
	});
};

export const useCampaignInviteAuditLogs = (campaignId: string) => {
	return useQuery({
		queryKey: ["campaigns", campaignId, "invite-audit"],
		queryFn: async (): Promise<CampaignInviteAuditLog[]> => {
			if (!isSupabaseConfigured || !campaignId) return [];

			const { data, error } = await supabaseAny
				.from("campaign_invite_audit_logs")
				.select("*")
				.eq("campaign_id", campaignId)
				.order("created_at", { ascending: false })
				.limit(50);

			if (error) {
				const errorMessage = error.message.toLowerCase();
				if (
					errorMessage.includes("does not exist") ||
					errorMessage.includes("could not find the table") ||
					errorMessage.includes("schema cache")
				) {
					return [];
				}
				throw error;
			}
			return (data || []) as CampaignInviteAuditLog[];
		},
		enabled: !!campaignId,
	});
};

export const useDeleteCampaignInvite = () => {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async ({
			inviteId,
			reason,
		}: {
			campaignId: string;
			inviteId: string;
			reason?: string;
		}) => {
			if (!isSupabaseConfigured) {
				throw new AppError("Supabase not configured", "CONFIG");
			}
			let { data, error } = await supabaseAny.rpc("revoke_campaign_invite", {
				p_invite_id: inviteId,
				p_reason: reason ?? undefined,
			});

			if (error && shouldFallbackToLegacyRevokeRpc(error)) {
				const deleteResult = await supabase
					.from("campaign_invites")
					.delete()
					.eq("id", inviteId);
				data = deleteResult.error ? null : true;
				error = deleteResult.error as unknown as Error | null;
			}

			if (error) throw error;
			if (!data) {
				throw new AppError(
					"Invite is already revoked or unavailable",
					"NOT_FOUND",
				);
			}
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["campaigns", variables.campaignId, "invites"],
			});
			queryClient.invalidateQueries({
				queryKey: ["campaigns", variables.campaignId, "invite-audit"],
			});
			toast({
				title: "Invite revoked",
				description: "The invite is no longer valid.",
			});
		},
		onError: (error: Error) => {
			toast({
				title: "Failed to revoke invite",
				description: error.message,
				variant: "destructive",
			});
		},
	});
};

export const useCampaignInviteByToken = (token: string) => {
	return useQuery({
		queryKey: ["campaigns", "invite", token],
		queryFn: async (): Promise<CampaignInviteSummary | null> => {
			const accessKey = normalizeInviteAccessKey(token);
			if (!accessKey || !isSupabaseConfigured) return null;
			const { data, error } = await supabaseAny.rpc(
				"get_campaign_invite_by_token",
				{ p_token: accessKey },
			);
			if (error) throw error;
			const invite = Array.isArray(data) ? data[0] : data;
			if (!invite) return null;
			return {
				...(invite as CampaignInviteSummary),
				status: deriveCampaignInviteStatus(invite as CampaignInviteSummary),
			};
		},
		enabled: !!token,
	});
};

export const useRedeemCampaignInvite = () => {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async ({
			token,
			characterId,
		}: {
			token: string;
			characterId?: string;
		}) => {
			if (!isSupabaseConfigured) {
				throw new AppError("Supabase not configured", "CONFIG");
			}
			const accessKey = normalizeInviteAccessKey(token);
			if (!accessKey) {
				throw new AppError("Invite token required", "INVALID_INPUT");
			}
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) throw new AppError("Not authenticated", "AUTH_REQUIRED");

			const { data, error } = await supabaseAny.rpc("redeem_campaign_invite", {
				p_token: accessKey,
				p_character_id: characterId ?? undefined,
			});

			if (error) throw error;
			return data as string;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["campaigns"] });
			queryClient.invalidateQueries({ queryKey: ["characters"] });
			toast({
				title: "Invite accepted",
				description: "You are now part of the campaign.",
			});
		},
		onError: (error: Error) => {
			toast({
				title: "Invite failed",
				description: error.message,
				variant: "destructive",
			});
		},
	});
};
