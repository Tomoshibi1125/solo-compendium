import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import type { SandboxNPC } from "@/data/compendium/sandbox-npcs";
import { useToast } from "@/hooks/use-toast";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { AppError } from "@/lib/appError";
import { useAuth } from "@/lib/auth/authContext";
import type { RaCurrencyId } from "@/lib/currency";
import { getLocalUserId } from "@/lib/guestStore";
import { guildAdminAction } from "@/lib/guildAdminAction";
import type {
	GuildBasePropertyState,
	GuildBaseState,
	GuildSkillsState,
} from "@/lib/guildBase";
import {
	type GuildCapabilities,
	type GuildRole,
	guildCapabilities,
	resolveGuildRole,
} from "@/lib/guildPermissions";
import { applyFundsDelta, type GuildFunds } from "@/lib/guildTreasury";

// ============================================================================
// Types
// ============================================================================

export interface Guild {
	id: string;
	name: string;
	description: string | null;
	motto: string | null;
	leader_user_id: string;
	campaign_id: string | null;
	share_code: string;
	is_active: boolean;
	settings: Record<string, unknown>;
	created_at: string;
	updated_at: string;
	// Guild rank/level progression + treasury (added in the roles/ranks migration;
	// optional so pre-migration local guilds still parse).
	guild_rank?: string;
	level?: number;
	contribution?: number;
	funds?: GuildFunds;
	// Guild Base (2F): built facility tiers + unlocked guild skills (JSONB columns,
	// optional so pre-migration local guilds still parse).
	base_facilities?: GuildBaseState;
	guild_skills?: GuildSkillsState;
	// Owned base property id (one of the pre-built bases or the buildable lot);
	// null/absent = no base acquired yet.
	base_property?: GuildBasePropertyState;
}

export interface GuildMember {
	id: string;
	guild_id: string;
	user_id: string | null;
	character_id: string | null;
	npc_id: string | null;
	npc_name: string | null;
	npc_data: SandboxNPC | null;
	role: GuildRole;
	rank?: string | null;
	joined_at: string;
	npc_level: number | null;
	npc_xp: number | null;
	npc_leveling_mode: "auto" | "manual" | null;
	// Joined character data (when applicable)
	characters?: {
		name: string;
		level: number;
		job: string | null;
	} | null;
}

// ============================================================================
// Local Storage Persistence
// ============================================================================

const GUILDS_KEY = "solo-compendium.guilds.v1";
const GUILD_MEMBERS_KEY = "solo-compendium.guilds.members.v1";

const guestEnabled = import.meta.env.VITE_GUEST_ENABLED !== "false";

const isLocalMode = (): boolean => {
	return !isSupabaseConfigured || import.meta.env.VITE_E2E === "true";
};

/**
 * Whether guild reads/writes should hit the per-browser local store.
 * True in local/E2E mode AND for guest visitors (no Supabase session) when
 * guest mode is enabled — guests create guilds locally, so every hook must
 * read/write the same store or guests end up with guilds they can't open.
 */
export const shouldUseLocalGuildStore = async (): Promise<boolean> => {
	if (isLocalMode()) return true;
	if (!guestEnabled) return false;
	const { data } = await supabase.auth.getSession();
	return !data.session?.user;
};

const shouldUseLocalGuilds = shouldUseLocalGuildStore;

export const loadLocalGuilds = (): Guild[] => {
	if (typeof window === "undefined") return [];
	const raw = window.localStorage.getItem(GUILDS_KEY);
	if (!raw) return [];
	try {
		const parsed = JSON.parse(raw) as Guild[];
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
};

export const saveLocalGuilds = (guilds: Guild[]) => {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(GUILDS_KEY, JSON.stringify(guilds));
};

export const loadLocalGuildMembers = (): GuildMember[] => {
	if (typeof window === "undefined") return [];
	const raw = window.localStorage.getItem(GUILD_MEMBERS_KEY);
	if (!raw) return [];
	try {
		const parsed = JSON.parse(raw) as GuildMember[];
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
};

export const saveLocalGuildMembers = (members: GuildMember[]) => {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(GUILD_MEMBERS_KEY, JSON.stringify(members));
};

const createShareCode = (): string => {
	const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
	let code = "";
	for (let i = 0; i < 6; i++) {
		code += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return code;
};

// ============================================================================
// Queries
// ============================================================================

/** Get guilds where user is leader */
export const useMyGuilds = () => {
	const { user, loading } = useAuth();
	return useQuery({
		queryKey: ["guilds", "mine"],
		queryFn: async (): Promise<Guild[]> => {
			if (await shouldUseLocalGuilds()) {
				const userId = getLocalUserId();
				return loadLocalGuilds().filter((g) => g.leader_user_id === userId);
			}
			if (!user) {
				if (guestEnabled) {
					const userId = getLocalUserId();
					return loadLocalGuilds().filter((g) => g.leader_user_id === userId);
				}
				return [];
			}
			const { data, error } = await supabase
				.from("guilds")
				.select("*")
				.eq("leader_user_id", user.id)
				.order("created_at", { ascending: false });
			if (error) throw error;
			return (data ?? []) as Guild[];
		},
		enabled: !loading,
	});
};

/** Get guilds where user is a member (not leader) */
export const useJoinedGuilds = () => {
	const { user, loading } = useAuth();
	return useQuery({
		queryKey: ["guilds", "joined"],
		queryFn: async (): Promise<Guild[]> => {
			if (await shouldUseLocalGuilds()) {
				const userId = getLocalUserId();
				const memberGuildIds = loadLocalGuildMembers()
					.filter((m) => m.user_id === userId)
					.map((m) => m.guild_id);
				return loadLocalGuilds().filter(
					(g) => memberGuildIds.includes(g.id) && g.leader_user_id !== userId,
				);
			}
			if (!user) {
				if (guestEnabled) {
					const userId = getLocalUserId();
					const memberGuildIds = loadLocalGuildMembers()
						.filter((m) => m.user_id === userId)
						.map((m) => m.guild_id);
					return loadLocalGuilds().filter(
						(g) => memberGuildIds.includes(g.id) && g.leader_user_id !== userId,
					);
				}
				return [];
			}
			// Get guilds user is a member of via guild_members
			const { data: memberRows, error: memberError } = await supabase
				.from("guild_members")
				.select("guild_id")
				.eq("user_id", user.id);
			if (memberError) throw memberError;
			if (!memberRows || memberRows.length === 0) return [];
			const guildIds = memberRows.map((m: { guild_id: string }) => m.guild_id);
			const { data, error } = await supabase
				.from("guilds")
				.select("*")
				.in("id", guildIds)
				.neq("leader_user_id", user.id)
				.order("created_at", { ascending: false });
			if (error) throw error;
			return (data ?? []) as Guild[];
		},
		enabled: !loading,
	});
};

/** Get single guild */
export const useGuild = (guildId: string) => {
	return useQuery({
		queryKey: ["guilds", guildId],
		queryFn: async (): Promise<Guild | null> => {
			if (await shouldUseLocalGuilds()) {
				return loadLocalGuilds().find((g) => g.id === guildId) ?? null;
			}
			const { data, error } = await supabase
				.from("guilds")
				.select("*")
				.eq("id", guildId)
				.single();
			if (error) return null;
			return data as Guild;
		},
		enabled: !!guildId,
	});
};

/** Get guilds linked to a specific campaign (hybrid scoping). */
export const useGuildsByCampaign = (campaignId: string | null | undefined) => {
	const { user } = useAuth();
	return useQuery({
		queryKey: ["guilds", "campaign", campaignId ?? "none"],
		queryFn: async (): Promise<Guild[]> => {
			if (!campaignId) return [];
			if (await shouldUseLocalGuilds()) {
				return loadLocalGuilds().filter((g) => g.campaign_id === campaignId);
			}
			if (!user) return [];
			const { data, error } = await supabase
				.from("guilds")
				.select("*")
				.eq("campaign_id", campaignId)
				.order("created_at", { ascending: false });
			if (error) throw error;
			return (data ?? []) as Guild[];
		},
		enabled: !!campaignId,
	});
};

/** Get guild members */
export const useGuildMembers = (guildId: string) => {
	return useQuery({
		queryKey: ["guilds", guildId, "members"],
		queryFn: async (): Promise<GuildMember[]> => {
			if (await shouldUseLocalGuilds()) {
				return loadLocalGuildMembers().filter((m) => m.guild_id === guildId);
			}
			const { data, error } = await supabase
				.from("guild_members")
				.select("*, characters(name, level, job)")
				.eq("guild_id", guildId)
				.order("joined_at", { ascending: true });
			if (error) throw error;
			return (data ?? []) as GuildMember[];
		},
		enabled: !!guildId,
	});
};

// ============================================================================
// Mutations
// ============================================================================

/** Create a new guild */
export const useCreateGuild = () => {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async (params: {
			name: string;
			description?: string;
			motto?: string;
			campaignId?: string;
			/** Founding character bound to the leader membership row (one guild per character). */
			characterId?: string;
		}): Promise<string> => {
			const shareCode = createShareCode();

			if (await shouldUseLocalGuilds()) {
				const userId = getLocalUserId();
				const id = crypto.randomUUID();
				const guild: Guild = {
					id,
					name: params.name,
					description: params.description ?? null,
					motto: params.motto ?? null,
					leader_user_id: userId,
					campaign_id: params.campaignId ?? null,
					share_code: shareCode,
					is_active: true,
					settings: {},
					created_at: new Date().toISOString(),
					updated_at: new Date().toISOString(),
				};
				const guilds = loadLocalGuilds();
				guilds.push(guild);
				saveLocalGuilds(guilds);

				// Add leader as member
				const member: GuildMember = {
					id: crypto.randomUUID(),
					guild_id: id,
					user_id: userId,
					character_id: params.characterId ?? null,
					npc_id: null,
					npc_name: null,
					npc_data: null,
					role: "leader",
					joined_at: new Date().toISOString(),
					npc_level: null,
					npc_xp: null,
					npc_leveling_mode: null,
				};
				const members = loadLocalGuildMembers();
				members.push(member);
				saveLocalGuildMembers(members);

				return id;
			}

			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) {
				if (guestEnabled) {
					const userId = getLocalUserId();
					const id = crypto.randomUUID();
					const guild: Guild = {
						id,
						name: params.name,
						description: params.description ?? null,
						motto: params.motto ?? null,
						leader_user_id: userId,
						campaign_id: params.campaignId ?? null,
						share_code: shareCode,
						is_active: true,
						settings: {},
						created_at: new Date().toISOString(),
						updated_at: new Date().toISOString(),
					};
					const guilds = loadLocalGuilds();
					guilds.push(guild);
					saveLocalGuilds(guilds);
					const member: GuildMember = {
						id: crypto.randomUUID(),
						guild_id: id,
						user_id: userId,
						character_id: params.characterId ?? null,
						npc_id: null,
						npc_name: null,
						npc_data: null,
						role: "leader",
						joined_at: new Date().toISOString(),
						npc_level: null,
						npc_xp: null,
						npc_leveling_mode: null,
					};
					const members = loadLocalGuildMembers();
					members.push(member);
					saveLocalGuildMembers(members);
					return id;
				}
				throw new AppError("Not authenticated", "AUTH_REQUIRED");
			}

			const rpcResult = await supabase.rpc("create_guild_with_code", {
				p_name: params.name,
				p_description: params.description ?? "",
				p_motto: params.motto ?? "",
				p_leader_user_id: user.id,
				p_campaign_id: params.campaignId,
				p_character_id: params.characterId,
			});

			if (rpcResult.error) throw rpcResult.error;

			return rpcResult.data as string;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["guilds"] });
			toast({
				title: "Guild Established",
				description: "Your guild has been created.",
			});
		},
		onError: (error: Error) => {
			const msg = String(error.message ?? "").toLowerCase();
			const oneGuildPerCharacter =
				msg.includes("guild_members_one_per_character") ||
				(msg.includes("duplicate key") && msg.includes("character"));
			toast({
				title: "Failed to create guild",
				description: oneGuildPerCharacter
					? "That character already leads or belongs to a guild. Each character may join only one guild."
					: error.message,
				variant: "destructive",
			});
		},
	});
};

/** Recruit an NPC into a guild */
export const useRecruitNPC = () => {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async (params: {
			guildId: string;
			npc: SandboxNPC;
			levelingMode?: "auto" | "manual";
		}) => {
			const member: GuildMember = {
				id: crypto.randomUUID(),
				guild_id: params.guildId,
				user_id: null,
				character_id: null,
				npc_id: params.npc.id,
				npc_name: params.npc.name,
				npc_data: params.npc,
				role: "recruit",
				joined_at: new Date().toISOString(),
				npc_level: params.npc.level,
				npc_xp: 0,
				npc_leveling_mode: params.levelingMode ?? "auto",
			};

			if (await shouldUseLocalGuilds()) {
				const members = loadLocalGuildMembers();
				members.push(member);
				saveLocalGuildMembers(members);
				return;
			}

			await guildAdminAction(params.guildId, "recruit_npc", {
				npc_id: params.npc.id,
				npc_name: params.npc.name,
				npc_data: JSON.parse(JSON.stringify(params.npc)),
				npc_level: params.npc.level,
				npc_leveling_mode: params.levelingMode ?? "auto",
			});
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["guilds", variables.guildId, "members"],
			});
			toast({
				title: "NPC Recruited",
				description: `${variables.npc.name} has joined your guild.`,
			});
		},
		onError: (error: Error) => {
			toast({
				title: "Recruitment failed",
				description: error.message,
				variant: "destructive",
			});
		},
	});
};

/** Level up an NPC in a guild */
export const useLevelUpNPC = () => {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async (params: { guildId: string; memberId: string }) => {
			if (await shouldUseLocalGuilds()) {
				const members = loadLocalGuildMembers();
				const idx = members.findIndex((m) => m.id === params.memberId);
				if (idx === -1) throw new Error("Member not found");
				const member = members[idx];
				if (!member.npc_data || !member.npc_level)
					throw new Error("Not an NPC");
				const maxLevel = member.npc_data.leveling.maxLevel;
				if (member.npc_level >= maxLevel)
					throw new Error("Already at max level");
				members[idx] = {
					...member,
					npc_level: member.npc_level + 1,
					npc_xp: 0,
				};
				saveLocalGuildMembers(members);
				return members[idx];
			}

			await guildAdminAction(params.guildId, "level_npc", {
				member_id: params.memberId,
			});
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["guilds", variables.guildId, "members"],
			});
			toast({
				title: "NPC Leveled Up",
				description: "Your recruit has grown stronger.",
			});
		},
		onError: (error: Error) => {
			toast({
				title: "Level up failed",
				description: error.message,
				variant: "destructive",
			});
		},
	});
};

/** Delete a guild */
export const useDeleteGuild = () => {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async (guildId: string) => {
			if (await shouldUseLocalGuilds()) {
				saveLocalGuilds(loadLocalGuilds().filter((g) => g.id !== guildId));
				saveLocalGuildMembers(
					loadLocalGuildMembers().filter((m) => m.guild_id !== guildId),
				);
				return;
			}
			await guildAdminAction(guildId, "disband_guild");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["guilds"] });
			toast({
				title: "Guild Disbanded",
				description: "The guild has been permanently disbanded.",
			});
		},
		onError: (error: Error) => {
			toast({
				title: "Failed to disband guild",
				description: error.message,
				variant: "destructive",
			});
		},
	});
};

/** Leave a guild */
export const useLeaveGuild = () => {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async (guildId: string) => {
			if (await shouldUseLocalGuilds()) {
				const userId = getLocalUserId();
				saveLocalGuildMembers(
					loadLocalGuildMembers().filter(
						(m) => !(m.guild_id === guildId && m.user_id === userId),
					),
				);
				return;
			}
			await guildAdminAction(guildId, "leave_guild");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["guilds"] });
			toast({
				title: "Left Guild",
				description: "You have departed from the guild.",
			});
		},
		onError: (error: Error) => {
			toast({
				title: "Failed to leave guild",
				description: error.message,
				variant: "destructive",
			});
		},
	});
};

/** Set NPC leveling mode */
export const useSetNPCLevelingMode = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (params: {
			guildId: string;
			memberId: string;
			mode: "auto" | "manual";
		}) => {
			if (await shouldUseLocalGuilds()) {
				const members = loadLocalGuildMembers();
				const idx = members.findIndex((m) => m.id === params.memberId);
				if (idx !== -1) {
					members[idx] = { ...members[idx], npc_leveling_mode: params.mode };
					saveLocalGuildMembers(members);
				}
				return;
			}
			await guildAdminAction(params.guildId, "set_npc_leveling_mode", {
				member_id: params.memberId,
				mode: params.mode,
			});
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["guilds", variables.guildId, "members"],
			});
		},
	});
};

// ============================================================================
// Role-based guild management (Guild Master ▸ Vice-Master ▸ … hierarchy)
// ============================================================================

/** Promote or demote a member to a new guild role. */
export const useChangeMemberRole = () => {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async (params: {
			guildId: string;
			memberId: string;
			role: GuildRole;
		}) => {
			if (await shouldUseLocalGuilds()) {
				const members = loadLocalGuildMembers();
				const idx = members.findIndex((m) => m.id === params.memberId);
				if (idx === -1) throw new Error("Member not found");
				members[idx] = { ...members[idx], role: params.role };
				saveLocalGuildMembers(members);
				return;
			}
			await guildAdminAction(params.guildId, "change_member_role", {
				member_id: params.memberId,
				role: params.role,
			});
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["guilds", variables.guildId, "members"],
			});
			toast({ title: "Role updated", description: "Guild role changed." });
		},
		onError: (error: Error) => {
			toast({
				title: "Failed to change role",
				description: error.message,
				variant: "destructive",
			});
		},
	});
};

/** Remove a member (player or NPC) from the guild. */
export const useKickMember = () => {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async (params: { guildId: string; memberId: string }) => {
			if (await shouldUseLocalGuilds()) {
				saveLocalGuildMembers(
					loadLocalGuildMembers().filter((m) => m.id !== params.memberId),
				);
				return;
			}
			await guildAdminAction(params.guildId, "remove_member", {
				member_id: params.memberId,
			});
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["guilds", variables.guildId, "members"],
			});
			toast({
				title: "Member removed",
				description: "They have left the roster.",
			});
		},
		onError: (error: Error) => {
			toast({
				title: "Failed to remove member",
				description: error.message,
				variant: "destructive",
			});
		},
	});
};

/** Hand the Guild Master role to another member (old leader becomes Vice-Master). */
export const useTransferLeadership = () => {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async (params: {
			guildId: string;
			newLeaderUserId: string;
			currentLeaderUserId: string;
		}) => {
			if (await shouldUseLocalGuilds()) {
				const guilds = loadLocalGuilds();
				const gIdx = guilds.findIndex((g) => g.id === params.guildId);
				if (gIdx === -1) throw new Error("Guild not found");
				guilds[gIdx] = {
					...guilds[gIdx],
					leader_user_id: params.newLeaderUserId,
				};
				saveLocalGuilds(guilds);
				const members = loadLocalGuildMembers().map((m) => {
					if (m.guild_id !== params.guildId) return m;
					if (m.user_id === params.newLeaderUserId)
						return { ...m, role: "leader" as GuildRole };
					if (m.user_id === params.currentLeaderUserId)
						return { ...m, role: "vice_master" as GuildRole };
					return m;
				});
				saveLocalGuildMembers(members);
				return;
			}
			await guildAdminAction(params.guildId, "transfer_leadership", {
				new_leader_user_id: params.newLeaderUserId,
			});
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ["guilds"] });
			queryClient.invalidateQueries({
				queryKey: ["guilds", variables.guildId, "members"],
			});
			toast({
				title: "Leadership transferred",
				description: "A new Guild Master now leads the guild.",
			});
		},
		onError: (error: Error) => {
			toast({
				title: "Failed to transfer leadership",
				description: error.message,
				variant: "destructive",
			});
		},
	});
};

/** Deposit (+) / withdraw or pay out (−) a currency in the guild treasury. */
export const useAdjustGuildFunds = () => {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async (params: {
			guildId: string;
			currency: RaCurrencyId;
			delta: number;
			note?: string;
		}): Promise<GuildFunds> => {
			if (await shouldUseLocalGuilds()) {
				const guilds = loadLocalGuilds();
				const idx = guilds.findIndex((g) => g.id === params.guildId);
				if (idx === -1) throw new AppError("Guild not found", "NOT_FOUND");
				const next = applyFundsDelta(
					guilds[idx].funds ?? {},
					params.currency,
					params.delta,
				);
				guilds[idx] = { ...guilds[idx], funds: next };
				saveLocalGuilds(guilds);
				return next;
			}
			return (await guildAdminAction(params.guildId, "adjust_funds", {
				currency: params.currency,
				delta: params.delta,
				note: params.note ?? null,
			})) as GuildFunds;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["guilds", variables.guildId],
			});
			queryClient.invalidateQueries({ queryKey: ["guilds"] });
			toast({
				title: variables.delta >= 0 ? "Funds deposited" : "Funds withdrawn",
				description: "The guild treasury has been updated.",
			});
		},
		onError: (error: Error) => {
			toast({
				title: "Treasury update failed",
				description: error.message,
				variant: "destructive",
			});
		},
	});
};

/** Edit public guild details through the role-checked guild mutation boundary. */
export const useUpdateGuildInfo = () => {
	const queryClient = useQueryClient();
	const { toast } = useToast();
	return useMutation({
		mutationFn: async (params: {
			guildId: string;
			name: string;
			description: string;
			motto: string;
		}) => {
			const name = params.name.trim();
			if (!name) throw new AppError("Guild name is required", "INVALID_INPUT");
			if (await shouldUseLocalGuilds()) {
				const guilds = loadLocalGuilds();
				const index = guilds.findIndex((guild) => guild.id === params.guildId);
				if (index < 0) throw new AppError("Guild not found", "NOT_FOUND");
				guilds[index] = {
					...guilds[index],
					name,
					description: params.description.trim() || null,
					motto: params.motto.trim() || null,
				};
				saveLocalGuilds(guilds);
			} else {
				await guildAdminAction(params.guildId, "update_info", {
					name,
					description: params.description.trim(),
					motto: params.motto.trim(),
				});
			}
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["guilds", variables.guildId],
			});
			queryClient.invalidateQueries({ queryKey: ["guilds"] });
			toast({ title: "Guild details updated" });
		},
		onError: (error: Error) => {
			toast({
				title: "Failed to update guild details",
				description: error.message,
				variant: "destructive",
			});
		},
	});
};

export interface GuildPermissions {
	currentUserId: string;
	role: GuildRole | null;
	capabilities: GuildCapabilities;
}

/** Resolve the current user's role + capabilities within a guild. */
export const useGuildPermissions = (
	guild: Guild | null | undefined,
	members: GuildMember[],
): GuildPermissions => {
	const { user } = useAuth();
	return useMemo(() => {
		const currentUserId = user?.id || getLocalUserId();
		const role = resolveGuildRole(
			members,
			currentUserId,
			guild?.leader_user_id ?? null,
		);
		return { currentUserId, role, capabilities: guildCapabilities(role) };
	}, [user?.id, members, guild?.leader_user_id]);
};
