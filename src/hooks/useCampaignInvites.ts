import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
	type Campaign,
	loadLocalCampaigns,
	loadLocalMembers,
	saveLocalCampaigns,
	saveLocalMembers,
} from "@/hooks/useCampaigns";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { AppError } from "@/lib/appError";
import {
	deriveCampaignInviteStatus,
	normalizeInviteAccessKey,
} from "@/lib/campaignInviteUtils";
import { notifyAsync } from "@/lib/notify";

const guestEnabled = import.meta.env.VITE_GUEST_ENABLED !== "false";

interface CampaignInviteRecord {
	id: string;
	campaign_id: string;
	token: string;
	role: "ascendant" | "co-warden";
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

export interface CampaignInvitePreview {
	campaign_id: string;
	campaign_name: string;
	campaign_description: string | null;
	role: "ascendant" | "co-warden";
	expires_at: string | null;
	status: "active" | "expired" | "revoked" | "used_up" | "unknown";
}

interface CampaignInviteCreateResult {
	id: string;
	token: string;
	join_code?: string | null;
	invite_url?: string | null;
	role: "ascendant" | "co-warden";
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

interface CampaignInviteAuditLog {
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
	role?: "ascendant" | "co-warden";
	expiresAt?: string | null;
	maxUses?: number;
	inviteEmail?: string;
};

class InviteApiUnavailableError extends Error {
	constructor(message = "Invite email API is unavailable") {
		super(message);
		this.name = "InviteApiUnavailableError";
	}
}

const normalizeInviteRecord = (
	invite: CampaignInviteRecord,
): CampaignInviteRecord => {
	const status = deriveCampaignInviteStatus(invite);
	return {
		...invite,
		status,
	};
};

const toCampaignInvitePreview = (
	value: unknown,
): CampaignInvitePreview | null => {
	if (!value || typeof value !== "object") return null;
	const candidate = value as Record<string, unknown>;
	if (
		typeof candidate.campaign_id !== "string" ||
		typeof candidate.campaign_name !== "string" ||
		(candidate.role !== "ascendant" && candidate.role !== "co-warden")
	) {
		return null;
	}

	const status = deriveCampaignInviteStatus({
		status: typeof candidate.status === "string" ? candidate.status : null,
		expires_at:
			typeof candidate.expires_at === "string" ? candidate.expires_at : null,
	});

	return {
		campaign_id: candidate.campaign_id,
		campaign_name: candidate.campaign_name,
		campaign_description:
			typeof candidate.campaign_description === "string"
				? candidate.campaign_description
				: null,
		role: candidate.role,
		expires_at:
			typeof candidate.expires_at === "string" ? candidate.expires_at : null,
		status,
	};
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
		if (response.status === 404 || response.status === 405) {
			throw new InviteApiUnavailableError();
		}
		const payload = (await response.json().catch(() => ({}))) as {
			error?: string;
		};
		throw new AppError(
			payload.error || "Failed to create invite via API",
			response.status === 401 || response.status === 403
				? "FORBIDDEN"
				: "UNKNOWN",
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
			const invites = (data || []) as CampaignInviteRecord[];
			return invites.map(normalizeInviteRecord);
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
			const normalizedInviteEmail =
				inviteEmail?.trim().toLowerCase() || undefined;

			if (!isSupabaseConfigured) {
				// Offline mock token generation so it always succeeds locally.
				return {
					id: crypto.randomUUID(),
					token: `LCL${crypto.randomUUID().split("-")[0]}`,
					join_code: `LCL${crypto.randomUUID().split("-")[0]}`
						.toUpperCase()
						.slice(0, 6),
					role,
					expires_at: expiresAt || null,
					max_uses: maxUses,
					used_count: 0,
					revoked_at: null,
					invite_email: normalizedInviteEmail || null,
					email_delivery: {
						attempted: false,
						sent: false,
						error: null,
					},
				} as CampaignInviteCreateResult;
			}

			if (normalizedInviteEmail) {
				try {
					return await createInviteViaApi({
						campaignId,
						role,
						expiresAt,
						maxUses,
						inviteEmail: normalizedInviteEmail,
					});
				} catch (error) {
					const canUseLocalFallback =
						import.meta.env.DEV &&
						(error instanceof InviteApiUnavailableError ||
							error instanceof TypeError);
					if (!canUseLocalFallback) throw error;
				}
			}

			const { data, error } = await supabase.rpc("create_campaign_invite", {
				p_campaign_id: campaignId,
				p_role: role,
				p_expires_at: expiresAt ?? undefined,
				p_max_uses: maxUses,
				p_invite_email: normalizedInviteEmail,
			});

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

export const useAddAscendantCharacterToCampaign = () => {
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

			const { data, error } = await supabase.rpc(
				"add_ascendant_character_to_campaign",
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
			queryClient.invalidateQueries({ queryKey: ["campaigns", "joined"] });
			queryClient.invalidateQueries({ queryKey: ["campaigns", "my"] });
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

export const useAddPlayerCharacterToCampaign = () =>
	useAddAscendantCharacterToCampaign();

export const useCampaignInviteAuditLogs = (campaignId: string) => {
	return useQuery({
		queryKey: ["campaigns", campaignId, "invite-audit"],
		queryFn: async (): Promise<CampaignInviteAuditLog[]> => {
			if (!isSupabaseConfigured || !campaignId) return [];

			const { data, error } = await supabase
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
			const { data, error } = await supabase.rpc("revoke_campaign_invite", {
				p_invite_id: inviteId,
				p_reason: reason ?? undefined,
			});

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
		queryFn: async (): Promise<CampaignInvitePreview | null> => {
			const accessKey = normalizeInviteAccessKey(token);
			if (!accessKey || !isSupabaseConfigured) return null;
			const { data, error } = await supabase.rpc(
				"get_campaign_invite_by_token",
				{ p_token: accessKey },
			);
			if (error) throw error;
			const response = Array.isArray(data) ? data[0] : data;
			return toCampaignInvitePreview(response);
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

			const { data, error } = await supabase.rpc("redeem_campaign_invite", {
				p_token: accessKey,
				p_character_id: characterId ?? undefined,
			});

			if (error) throw error;
			const campaignId = data as string;

			// Dual persistence constraint for joining via redeem:
			const { data: joinedCampaign, error: fetchError } = await supabase
				.from("campaigns")
				.select("*")
				.eq("id", campaignId)
				.maybeSingle();

			if (!fetchError && joinedCampaign) {
				const { data: memberRow } = await supabase
					.from("campaign_members")
					.select("role")
					.eq("campaign_id", campaignId)
					.eq("user_id", user.id)
					.maybeSingle();
				const memberRole =
					memberRow?.role === "co-warden" ? "co-warden" : "ascendant";
				const localCampaigns = loadLocalCampaigns();
				if (!localCampaigns.some((c) => c.id === campaignId)) {
					saveLocalCampaigns([joinedCampaign as Campaign, ...localCampaigns]);
				}
				const localMembers = loadLocalMembers();
				const memberIdx = localMembers.findIndex(
					(m) => m.campaign_id === campaignId && m.user_id === user.id,
				);
				if (memberIdx === -1) {
					localMembers.push({
						id: crypto.randomUUID(),
						campaign_id: campaignId,
						user_id: user.id,
						character_id: characterId || null,
						role: memberRole,
						joined_at: new Date().toISOString(),
					});
					saveLocalMembers(localMembers);
				} else {
					if (characterId) {
						localMembers[memberIdx].character_id = characterId;
					}
					localMembers[memberIdx].role = memberRole;
					saveLocalMembers(localMembers);
				}
			}

			// Notify the campaign owner (warden) that a new Ascendant joined —
			// the high-signal DDB-style membership event. Fire-and-forget so a
			// failed notification never blocks the join.
			const wardenId = joinedCampaign?.warden_id;
			if (wardenId && wardenId !== user.id) {
				notifyAsync({
					userId: wardenId,
					type: "campaign_invite",
					title: "New Ascendant joined your campaign",
					message: joinedCampaign?.name
						? `"${joinedCampaign.name}" has a new member.`
						: "Your campaign has a new member.",
					category: "campaign",
					payload: { campaign_id: campaignId },
					link: `/campaigns/${campaignId}`,
				});
			}

			return campaignId;
		},
		onSuccess: (campaignId) => {
			queryClient.invalidateQueries({ queryKey: ["campaigns", "joined"] });
			queryClient.invalidateQueries({ queryKey: ["campaigns", "my"] });
			queryClient.invalidateQueries({ queryKey: ["characters"] });
			toast({
				title: "Invite accepted",
				description: "You are now part of the campaign.",
			});

			// Route the join confirmation through the single notify() bridge so
			// it persists server-side (and surfaces on every device), not just
			// the local cache. Targets the current user (the joiner).
			notifyAsync({
				type: "success",
				title: "Campaign invite accepted",
				message:
					"You've joined a new campaign — open it from the Campaigns list.",
				category: "campaign",
				link: `/campaigns/${campaignId}`,
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
