// React Query hooks for the Rift Console user registry + admin audit log.
// Warden/admin-only surface: profiles RLS exposes all rows to wardens, and
// the mutations go through SECURITY DEFINER RPCs that audit atomically.
// No local/guest mode — user management only exists against the real backend.

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

export interface AdminUserRow {
	id: string;
	email: string;
	display_name: string | null;
	role: string;
	banned_at: string | null;
	created_at: string;
}

export interface AdminAuditRow {
	id: string;
	actor_user_id: string;
	action: string;
	target_user_id: string | null;
	details: Json;
	created_at: string | null;
}

/** Every registered account, newest first (warden RLS shows all profiles). */
export const useAdminUsers = () => {
	return useQuery({
		queryKey: ["admin", "users"],
		enabled: isSupabaseConfigured,
		queryFn: async (): Promise<AdminUserRow[]> => {
			const { data, error } = await supabase
				.from("profiles")
				.select("id, email, display_name, role, banned_at, created_at")
				.order("created_at", { ascending: false });
			if (error) throw error;
			return (data ?? []) as AdminUserRow[];
		},
	});
};

/** The immutable admin action trail (who/what/when), newest first. */
export const useAdminAuditLog = (limit = 50) => {
	return useQuery({
		queryKey: ["admin", "audit-log", limit],
		enabled: isSupabaseConfigured,
		queryFn: async (): Promise<AdminAuditRow[]> => {
			const { data, error } = await supabase
				.from("admin_audit_log")
				.select("*")
				.order("created_at", { ascending: false })
				.limit(limit);
			if (error) throw error;
			return (data ?? []) as AdminAuditRow[];
		},
	});
};

const useAdminMutation = (
	action: (params: {
		userId: string;
		value: string | boolean;
	}) => Promise<void>,
	successTitle: (value: string | boolean) => string,
) => {
	const queryClient = useQueryClient();
	const { toast } = useToast();
	return useMutation({
		mutationFn: action,
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ["admin"] });
			toast({ title: successTitle(variables.value) });
		},
		onError: (error: Error) => {
			toast({
				title: "User update failed",
				description: error.message,
				variant: "destructive",
			});
		},
	});
};

/** Warden: change an account's role (audited server-side). */
export const useSetUserRole = () =>
	useAdminMutation(
		async ({ userId, value }) => {
			const { error } = await supabase.rpc("admin_set_user_role", {
				p_target: userId,
				p_role: String(value),
			});
			if (error) throw error;
		},
		(value) => `Role changed to ${value}`,
	);

/** Warden: suspend / reinstate an account (audited server-side). */
export const useSetUserBan = () =>
	useAdminMutation(
		async ({ userId, value }) => {
			const { error } = await supabase.rpc("admin_set_user_ban", {
				p_target: userId,
				p_banned: Boolean(value),
			});
			if (error) throw error;
		},
		(value) => (value ? "Account suspended" : "Account reinstated"),
	);
