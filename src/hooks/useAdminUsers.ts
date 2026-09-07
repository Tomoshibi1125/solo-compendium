// React Query hooks for the account registry and immutable admin audit log.
// The UI claim is defense in depth only; database RLS and RPC checks remain
// authoritative and read canonical auth.users app_metadata server-side.

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { AppError } from "@/lib/appError";
import { useAuth } from "@/lib/auth/authContext";

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

/** Every registered account, newest first (account-admin RLS only). */
export const useAdminUsers = () => {
	const { user } = useAuth();
	const accountAdminId = user?.isAccountAdmin ? user.id : null;
	return useQuery({
		queryKey: ["account-admin", accountAdminId, "users"],
		enabled: isSupabaseConfigured && accountAdminId !== null,
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

/** The immutable account-admin action trail, newest first. */
export const useAdminAuditLog = (limit = 50) => {
	const { user } = useAuth();
	const accountAdminId = user?.isAccountAdmin ? user.id : null;
	return useQuery({
		queryKey: ["account-admin", accountAdminId, "audit-log", limit],
		enabled: isSupabaseConfigured && accountAdminId !== null,
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
	const { user } = useAuth();
	return useMutation({
		mutationFn: async (params: { userId: string; value: string | boolean }) => {
			if (!user?.isAccountAdmin) {
				throw new AppError(
					"Account administrator access is required.",
					"FORBIDDEN",
				);
			}
			await action(params);
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["account-admin", user?.id],
			});
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

/** Account administrator: change an account's gameplay role (audited server-side). */
export const useSetUserRole = () =>
	useAdminMutation(
		async ({ userId, value }) => {
			const { error } = await supabase.rpc("admin_set_user_role", {
				p_target: userId,
				p_role: String(value),
			});
			if (error) throw error;
		},
		(value) => `Gameplay role changed to ${value}`,
	);

/** Account administrator: suspend or reinstate an account (audited server-side). */
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
