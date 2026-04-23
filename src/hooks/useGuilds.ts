import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { SandboxNPC } from "@/data/compendium/sandbox-npcs";
import { useToast } from "@/hooks/use-toast";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { AppError } from "@/lib/appError";
import { useAuth } from "@/lib/auth/authContext";
import { getLocalUserId } from "@/lib/guestStore";

// ============================================================================
// Types
// ============================================================================

interface Guild {
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
}

interface GuildMember {
	id: string;
	guild_id: string;
	user_id: string | null;
	character_id: string | null;
	npc_id: string | null;
	npc_name: string | null;
	npc_data: SandboxNPC | null;
	role: "leader" | "officer" | "member" | "recruit";
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

const loadLocalGuilds = (): Guild[] => {
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

const saveLocalGuilds = (guilds: Guild[]) => {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(GUILDS_KEY, JSON.stringify(guilds));
};

const loadLocalGuildMembers = (): GuildMember[] => {
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

const saveLocalGuildMembers = (members: GuildMember[]) => {
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
			if (isLocalMode()) {
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
			if (isLocalMode()) {
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
			if (isLocalMode()) {
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

/** Get guild members */
export const useGuildMembers = (guildId: string) => {
	return useQuery({
		queryKey: ["guilds", guildId, "members"],
		queryFn: async (): Promise<GuildMember[]> => {
			if (isLocalMode()) {
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
		}): Promise<string> => {
			const shareCode = createShareCode();

			if (isLocalMode()) {
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
					character_id: null,
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
						character_id: null,
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
			});

			if (rpcResult.error) {
				const msg = String(rpcResult.error.message ?? "").toLowerCase();
				const isRpcMissing =
					msg.includes("does not exist") || msg.includes("no function matches");

				if (!isRpcMissing) {
					throw rpcResult.error;
				}

				// Fallback: direct INSERT when RPC doesn't exist
				const id = crypto.randomUUID();
				const now = new Date().toISOString();
				const { error: insertError } = await supabase.from("guilds").insert({
					id,
					name: params.name,
					description: params.description ?? null,
					motto: params.motto ?? null,
					leader_user_id: user.id,
					campaign_id: params.campaignId ?? null,
					share_code: shareCode,
					is_active: true,
					settings: {},
					created_at: now,
					updated_at: now,
				});
				if (insertError) throw insertError;

				await supabase.from("guild_members").insert({
					guild_id: id,
					user_id: user.id,
					role: "leader",
				});

				return id;
			}

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
			toast({
				title: "Failed to create guild",
				description: error.message,
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

			if (isLocalMode() || !isSupabaseConfigured) {
				const members = loadLocalGuildMembers();
				members.push(member);
				saveLocalGuildMembers(members);
				return;
			}

			const { error } = await supabase.from("guild_members").insert({
				guild_id: params.guildId,
				npc_id: params.npc.id,
				npc_name: params.npc.name,
				npc_data: JSON.parse(JSON.stringify(params.npc)),
				role: "recruit",
				npc_level: params.npc.level,
				npc_xp: 0,
				npc_leveling_mode: params.levelingMode ?? "auto",
			});
			if (error) throw error;
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
			if (isLocalMode() || !isSupabaseConfigured) {
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

			const { data: memberRow, error: fetchError } = await supabase
				.from("guild_members")
				.select("npc_level, npc_data")
				.eq("id", params.memberId)
				.single();
			if (fetchError) throw fetchError;
			const currentLevel = (memberRow as { npc_level: number }).npc_level || 1;
			const { error } = await supabase
				.from("guild_members")
				.update({ npc_level: currentLevel + 1, npc_xp: 0 })
				.eq("id", params.memberId);
			if (error) throw error;
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
			if (isLocalMode() || !isSupabaseConfigured) {
				saveLocalGuilds(loadLocalGuilds().filter((g) => g.id !== guildId));
				saveLocalGuildMembers(
					loadLocalGuildMembers().filter((m) => m.guild_id !== guildId),
				);
				return;
			}
			const { error } = await supabase
				.from("guilds")
				.delete()
				.eq("id", guildId);
			if (error) throw error;
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
			if (isLocalMode() || !isSupabaseConfigured) {
				const userId = getLocalUserId();
				saveLocalGuildMembers(
					loadLocalGuildMembers().filter(
						(m) => !(m.guild_id === guildId && m.user_id === userId),
					),
				);
				return;
			}
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) throw new AppError("Not authenticated", "AUTH_REQUIRED");
			const { error } = await supabase
				.from("guild_members")
				.delete()
				.eq("guild_id", guildId)
				.eq("user_id", user.id);
			if (error) throw error;
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
			if (isLocalMode() || !isSupabaseConfigured) {
				const members = loadLocalGuildMembers();
				const idx = members.findIndex((m) => m.id === params.memberId);
				if (idx !== -1) {
					members[idx] = { ...members[idx], npc_leveling_mode: params.mode };
					saveLocalGuildMembers(members);
				}
				return;
			}
			const { error } = await supabase
				.from("guild_members")
				.update({ npc_leveling_mode: params.mode })
				.eq("id", params.memberId);
			if (error) throw error;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["guilds", variables.guildId, "members"],
			});
		},
	});
};
