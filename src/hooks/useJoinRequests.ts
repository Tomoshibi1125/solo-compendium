import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { AppError } from "@/lib/appError";
import { getLocalUserId } from "@/lib/guestStore";
import {
	type ApprovableRole,
	approveJoinRequestLocal,
	type GuildJoinRequest,
	listLocalPendingJoinRequests,
	rejectJoinRequestLocal,
	requestToJoinGuildLocal,
} from "@/lib/guildJoinRequests";

export type { GuildJoinRequest } from "@/lib/guildJoinRequests";

const guestEnabled = import.meta.env.VITE_GUEST_ENABLED !== "false";

const isLocalMode = (): boolean =>
	!isSupabaseConfigured || import.meta.env.VITE_E2E === "true";

const isGuestGuildStore = (): boolean =>
	isLocalMode() || (!isSupabaseConfigured && guestEnabled);

// ============================================================================
// Queries
// ============================================================================

/** Pending join requests for a guild (Guild Master / Vice-Master approval queue). */
export const useGuildJoinRequests = (guildId: string | undefined) => {
	return useQuery({
		queryKey: ["guilds", guildId ?? "none", "join-requests"],
		queryFn: async (): Promise<GuildJoinRequest[]> => {
			if (!guildId) return [];
			if (isGuestGuildStore()) return listLocalPendingJoinRequests(guildId);
			const { data, error } = await supabase
				.from("guild_join_requests")
				.select("*")
				.eq("guild_id", guildId)
				.eq("status", "pending")
				.order("created_at", { ascending: true });
			if (error) {
				if (guestEnabled) return listLocalPendingJoinRequests(guildId);
				throw error;
			}
			return (data ?? []) as GuildJoinRequest[];
		},
		enabled: !!guildId,
	});
};

// ============================================================================
// Mutations
// ============================================================================

/** Request to join a guild by its share code, with a chosen character. */
export const useRequestToJoinGuild = () => {
	const { toast } = useToast();

	return useMutation({
		mutationFn: async (params: {
			shareCode: string;
			characterId?: string;
			message?: string;
		}): Promise<string> => {
			const code = params.shareCode.trim().toUpperCase();
			if (!code) throw new AppError("Enter a share code", "INVALID_INPUT");

			if (isGuestGuildStore()) {
				return requestToJoinGuildLocal({
					shareCode: code,
					userId: getLocalUserId(),
					characterId: params.characterId,
					message: params.message,
				}).id;
			}

			const { data, error } = await supabase.rpc("request_to_join_guild", {
				p_share_code: code,
				p_character_id: params.characterId,
				p_message: params.message,
			});
			if (error) {
				const msg = String(error.message ?? "").toLowerCase();
				if (msg.includes("duplicate key") || msg.includes("one_pending")) {
					throw new AppError(
						"You already have a pending request for this guild",
						"INVALID_INPUT",
						error,
					);
				}
				throw error;
			}
			return data as string;
		},
		onSuccess: () => {
			toast({
				title: "Request sent",
				description:
					"Your request to join has been sent for the guild leaders to review.",
			});
		},
		onError: (error: Error) => {
			toast({
				title: "Failed to send request",
				description: error.message,
				variant: "destructive",
			});
		},
	});
};

/** Approve a pending join request → adds the applicant as a character-bound member. */
export const useApproveJoinRequest = () => {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async (params: {
			requestId: string;
			guildId: string;
			role?: ApprovableRole;
		}) => {
			const role: ApprovableRole = params.role ?? "member";
			if (isGuestGuildStore()) {
				approveJoinRequestLocal({ requestId: params.requestId, role });
				return;
			}
			const { error } = await supabase.rpc("approve_guild_join_request", {
				p_request_id: params.requestId,
				p_role: role,
			});
			if (error) throw error;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["guilds", variables.guildId, "join-requests"],
			});
			queryClient.invalidateQueries({
				queryKey: ["guilds", variables.guildId, "members"],
			});
			queryClient.invalidateQueries({ queryKey: ["guilds"] });
			toast({
				title: "Member admitted",
				description: "The applicant has joined the guild.",
			});
		},
		onError: (error: Error) => {
			toast({
				title: "Failed to approve request",
				description: error.message,
				variant: "destructive",
			});
		},
	});
};

/** Reject a pending join request. */
export const useRejectJoinRequest = () => {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async (params: { requestId: string; guildId: string }) => {
			if (isGuestGuildStore()) {
				rejectJoinRequestLocal(params.requestId);
				return;
			}
			const { error } = await supabase
				.from("guild_join_requests")
				.update({
					status: "rejected",
					resolved_at: new Date().toISOString(),
				})
				.eq("id", params.requestId);
			if (error) throw error;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["guilds", variables.guildId, "join-requests"],
			});
			toast({
				title: "Request declined",
				description: "The join request has been declined.",
			});
		},
		onError: (error: Error) => {
			toast({
				title: "Failed to decline request",
				description: error.message,
				variant: "destructive",
			});
		},
	});
};
