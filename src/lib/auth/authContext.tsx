/**
 * Authentication Context
 * Role-based authentication for Rift Ascendant
 */

import type { Session, User } from "@supabase/supabase-js";
import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
} from "react";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { AppError } from "@/lib/appError";
import {
	type AuthErrorKind,
	type AuthOperation,
	normalizeAuthError,
	validateNewPassword,
} from "@/lib/auth/authErrors";
import {
	buildAuthCallbackUrl,
	buildPasswordResetRedirectUrl,
} from "@/lib/authRedirect";
import { error as logError } from "@/lib/logger";
import { useAuthStore } from "@/stores/authStore";

export type UserRole = "warden" | "ascendant";

export interface AuthUser {
	id: string;
	email: string;
	role: UserRole;
	/** UI capability hint derived only from Supabase app_metadata. */
	isAccountAdmin: boolean;
	displayName?: string;
	avatar?: string;
	createdAt: string;
	user_metadata?: Record<string, unknown>;
}

export type AuthProfileUpdates = Partial<
	Pick<AuthUser, "displayName" | "avatar" | "role">
>;

export type AuthResult = {
	error?: string;
	errorKind?: AuthErrorKind;
	success?: boolean;
	needsEmailConfirmation?: boolean;
};

export interface PasswordChangeInput {
	password: string;
	nonce: string;
}

interface AuthContextType {
	user: AuthUser | null;
	session: Session | null;
	loading: boolean;
	signIn: (
		email: string,
		password: string,
		role: UserRole,
	) => Promise<AuthResult>;
	signUp: (
		email: string,
		password: string,
		displayName: string,
		role: UserRole,
	) => Promise<AuthResult>;
	signOut: () => Promise<void>;
	requestPasswordReset: (email: string) => Promise<AuthResult>;
	resendConfirmationEmail: (email: string) => Promise<AuthResult>;
	beginPasswordChange: () => Promise<AuthResult>;
	confirmPasswordChange: (input: PasswordChangeInput) => Promise<AuthResult>;
	completePasswordRecovery: (password: string) => Promise<AuthResult>;
	updateProfile: (
		updates: AuthProfileUpdates,
	) => Promise<{ error?: string; success?: boolean }>;
	hasPermission: (permission: string) => boolean;
	isWarden: () => boolean;
	isPlayer: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const normalizeRole = (value?: string | null): UserRole => {
	if (value === "warden" || value === "Warden" || value === "dm")
		return "warden";
	if (value === "ascendant" || value === "player") return "ascendant";
	if (value) {
		logError("Invalid role value encountered, defaulting to ascendant:", value);
	}
	return "ascendant";
};

const buildFallbackUser = (authUser: User): AuthUser => {
	const metadata = authUser.user_metadata || {};
	const displayName =
		typeof metadata.display_name === "string"
			? metadata.display_name
			: typeof metadata.full_name === "string"
				? metadata.full_name
				: undefined;
	const avatar =
		typeof metadata.avatar_url === "string"
			? metadata.avatar_url
			: typeof metadata.avatar === "string"
				? metadata.avatar
				: undefined;

	return {
		id: authUser.id,
		email: authUser.email ?? "",
		role: normalizeRole(
			typeof metadata.role === "string" ? metadata.role : undefined,
		),
		isAccountAdmin: authUser.app_metadata?.account_role === "admin",
		displayName,
		avatar,
		createdAt: authUser.created_at ?? new Date().toISOString(),
		user_metadata: metadata,
	};
};

const toAuthFailure = (
	error: unknown,
	operation: AuthOperation,
): AuthResult => {
	const normalizedError = normalizeAuthError(error, operation);
	return {
		error: normalizedError.message,
		errorKind: normalizedError.kind,
	};
};

const withTimeout = async <T,>(
	promise: PromiseLike<T>,
	timeoutMs: number,
	label: string,
): Promise<T> => {
	let timeoutId: ReturnType<typeof setTimeout> | null = null;
	const timeout = new Promise<never>((_, reject) => {
		timeoutId = setTimeout(() => {
			reject(new Error(`${label} timed out after ${timeoutMs}ms`));
		}, timeoutMs);
	});

	try {
		return await Promise.race([Promise.resolve(promise), timeout]);
	} finally {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}
	}
};

export function AuthProvider({ children }: { children: ReactNode }) {
	const user = useAuthStore((s) => s.user);
	const session = useAuthStore((s) => s.session);
	const loading = useAuthStore((s) => s.loading);

	// Role-based permissions
	const permissions: Record<string, string[]> = {
		warden: [
			"view:dm_tools",
			"manage:campaigns",
			"manage:players",
			"generate:art",
			"manage:audio",
			"view:compendium",
			"edit:compendium",
			"manage:quests",
			"view:analytics",
		],
		ascendant: [
			"view:player_tools",
			"view:character_sheet",
			"view:compendium",
			"generate:character_art",
			"view:quests",
			"participate:campaign",
		],
	};

	const fetchUserProfile = useCallback(async (authUser: User) => {
		const fallbackUser = buildFallbackUser(authUser);

		try {
			const { data, error } = await withTimeout(
				supabase
					.from("profiles")
					.select("id, role, created_at")
					.eq("id", authUser.id)
					.single(),
				8000,
				"Fetch profile",
			);

			if (error) {
				logError("Error fetching user profile:", error);
				useAuthStore.getState().setUser(fallbackUser);
				return;
			}

			if (data) {
				const metadataRole =
					typeof authUser.user_metadata?.role === "string"
						? authUser.user_metadata.role
						: undefined;
				const resolvedRole = normalizeRole(metadataRole ?? data.role);
				useAuthStore.getState().setUser({
					id: data.id,
					email: authUser.email ?? "",
					role: resolvedRole,
					isAccountAdmin: fallbackUser.isAccountAdmin,
					displayName: fallbackUser.displayName,
					avatar: fallbackUser.avatar,
					createdAt: data.created_at,
					user_metadata: fallbackUser.user_metadata,
				});
			} else {
				useAuthStore.getState().setUser(fallbackUser);
			}
		} catch (error) {
			logError("Error fetching user profile:", error);
			useAuthStore.getState().setUser(fallbackUser);
		} finally {
			useAuthStore.getState().setLoading(false);
		}
	}, []);

	useEffect(() => {
		// Get initial session
		withTimeout(supabase.auth.getSession(), 8000, "Load session")
			.then(({ data: { session } }) => {
				useAuthStore.getState().setSession(session);
				if (session?.user) {
					fetchUserProfile(session.user);
				} else {
					useAuthStore.getState().setLoading(false);
				}
			})
			.catch((error) => {
				logError("Error loading session:", error);
				useAuthStore.getState().setSession(null);
				useAuthStore.getState().setUser(null);
				useAuthStore.getState().setLoading(false);
			});

		// Listen for auth changes
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (_event, session) => {
			useAuthStore.getState().setSession(session);
			if (session?.user) {
				useAuthStore.getState().setLoading(true);
				try {
					await withTimeout(
						fetchUserProfile(session.user),
						8000,
						"Sync profile",
					);
				} catch (error) {
					logError("Error syncing user profile:", error);
					useAuthStore.getState().setLoading(false);
				}
			} else {
				useAuthStore.getState().setUser(null);
				useAuthStore.getState().setLoading(false);
			}
		});

		return () => subscription.unsubscribe();
	}, [fetchUserProfile]);

	useEffect(() => {
		if (!session?.user || user) return;
		useAuthStore.getState().setUser(buildFallbackUser(session.user));
		useAuthStore.getState().setLoading(false);
	}, [session, user]);

	const signIn = async (email: string, password: string, role: UserRole) => {
		if (!isSupabaseConfigured) {
			return toAuthFailure(
				{ code: "CONFIG", message: "Backend is not configured" },
				"sign-in",
			);
		}

		try {
			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (error) return toAuthFailure(error, "sign-in");

			if (data.user) {
				// App-level suspension (admin_set_user_ban): banned accounts are
				// bounced before any role/profile writes happen.
				const { data: profileRow } = await supabase
					.from("profiles")
					.select("banned_at")
					.eq("id", data.user.id)
					.maybeSingle();
				if (profileRow?.banned_at) {
					await supabase.auth.signOut();
					return toAuthFailure(
						{ code: "user_banned", message: "Account has been suspended" },
						"sign-in",
					);
				}

				// Existing users logging in already have a profile due to the handle_new_user trigger.
				// We use .update() instead of .upsert() to avoid strict INSERT RLS check violations for existing rows.
				const { error: upsertError } = await supabase
					.from("profiles")
					.update({
						role,
						updated_at: new Date().toISOString(),
					})
					.eq("id", data.user.id);

				if (upsertError) {
					await supabase.auth.signOut();
					return toAuthFailure(upsertError, "profile-update");
				}

				// Keep mutable gameplay metadata synchronized; account authority is
				// never written here and comes only from app_metadata.
				const { error: metadataError } = await supabase.auth.updateUser({
					data: { role },
				});
				if (metadataError) {
					await supabase.auth.signOut();
					return toAuthFailure(metadataError, "profile-update");
				}
			}

			return { success: true };
		} catch (error) {
			return toAuthFailure(error, "sign-in");
		}
	};

	const signUp = async (
		email: string,
		password: string,
		displayName: string,
		role: UserRole,
	) => {
		if (!isSupabaseConfigured) {
			return toAuthFailure(
				{ code: "CONFIG", message: "Backend is not configured" },
				"sign-up",
			);
		}
		const passwordValidation = validateNewPassword(password);
		if (!passwordValidation.valid) {
			return {
				error: passwordValidation.message,
				errorKind: "weak-password" as const,
			};
		}

		try {
			// Create auth user
			const redirectTo = buildAuthCallbackUrl();
			const { data, error } = await supabase.auth.signUp({
				email,
				password,
				options: {
					data: {
						display_name: displayName,
						role: role,
					},
					emailRedirectTo: redirectTo,
				},
			});

			if (error) return toAuthFailure(error, "sign-up");

			if (!data.session) {
				return { success: true, needsEmailConfirmation: true };
			}

			if (data.user) {
				// Ensure profile exists and role is set; profile row is created by trigger.
				const { error: profileError } = await supabase.from("profiles").upsert(
					{
						id: data.user.id,
						email: data.user.email ?? email,
						role,
						updated_at: new Date().toISOString(),
					},
					{ onConflict: "id" },
				);

				if (profileError) {
					return toAuthFailure(profileError, "profile-update");
				}
			}

			return { success: true };
		} catch (error) {
			return toAuthFailure(error, "sign-up");
		}
	};

	const signOut = async () => {
		await supabase.auth.signOut();
		useAuthStore.getState().setUser(null);
		useAuthStore.getState().setSession(null);
	};

	const requestPasswordReset = async (email: string): Promise<AuthResult> => {
		if (!isSupabaseConfigured) {
			return toAuthFailure(
				{ code: "CONFIG", message: "Backend is not configured" },
				"reset-request",
			);
		}

		try {
			const { error } = await supabase.auth.resetPasswordForEmail(email, {
				redirectTo: buildPasswordResetRedirectUrl(),
			});
			if (error) return toAuthFailure(error, "reset-request");
			return { success: true };
		} catch (error) {
			return toAuthFailure(error, "reset-request");
		}
	};

	const resendConfirmationEmail = async (
		email: string,
	): Promise<AuthResult> => {
		if (!isSupabaseConfigured) {
			return toAuthFailure(
				{ code: "CONFIG", message: "Backend is not configured" },
				"resend-confirmation",
			);
		}

		try {
			const { error } = await supabase.auth.resend({
				type: "signup",
				email,
				options: { emailRedirectTo: buildAuthCallbackUrl() },
			});
			if (error) return toAuthFailure(error, "resend-confirmation");
			return { success: true };
		} catch (error) {
			return toAuthFailure(error, "resend-confirmation");
		}
	};

	const beginPasswordChange = async (): Promise<AuthResult> => {
		if (!isSupabaseConfigured) {
			return toAuthFailure(
				{ code: "CONFIG", message: "Backend is not configured" },
				"reauthenticate",
			);
		}

		try {
			const { data, error: sessionError } = await supabase.auth.getSession();
			if (sessionError) return toAuthFailure(sessionError, "reauthenticate");
			if (!data.session) {
				return toAuthFailure(
					{ code: "session_not_found", message: "Auth session missing" },
					"reauthenticate",
				);
			}
			const { error } = await supabase.auth.reauthenticate();
			if (error) return toAuthFailure(error, "reauthenticate");
			return { success: true };
		} catch (error) {
			return toAuthFailure(error, "reauthenticate");
		}
	};

	const confirmPasswordChange = async ({
		password,
		nonce,
	}: PasswordChangeInput): Promise<AuthResult> => {
		const passwordValidation = validateNewPassword(password);
		if (!passwordValidation.valid) {
			return {
				error: passwordValidation.message,
				errorKind: "weak-password",
			};
		}
		if (!nonce.trim()) {
			return toAuthFailure(
				{ code: "reauth_nonce_missing", message: "Missing nonce" },
				"password-change",
			);
		}

		try {
			const { error } = await supabase.auth.updateUser({
				password,
				nonce: nonce.trim(),
			});
			if (error) return toAuthFailure(error, "password-change");
			return { success: true };
		} catch (error) {
			return toAuthFailure(error, "password-change");
		}
	};

	const completePasswordRecovery = async (
		password: string,
	): Promise<AuthResult> => {
		const passwordValidation = validateNewPassword(password);
		if (!passwordValidation.valid) {
			return {
				error: passwordValidation.message,
				errorKind: "weak-password",
			};
		}

		try {
			const { error } = await supabase.auth.updateUser({ password });
			if (error) return toAuthFailure(error, "reset-complete");

			const { error: signOutError } = await supabase.auth.signOut({
				scope: "local",
			});
			if (signOutError) {
				logError("Password changed but local sign-out failed:", signOutError);
			}
			useAuthStore.getState().setUser(null);
			useAuthStore.getState().setSession(null);
			return { success: true };
		} catch (error) {
			return toAuthFailure(error, "reset-complete");
		}
	};

	const updateProfile = async (updates: AuthProfileUpdates) => {
		if (!user) {
			return toAuthFailure(
				{ code: "session_not_found", message: "Auth session missing" },
				"profile-update",
			);
		}

		try {
			const metadataUpdates: Record<string, unknown> = {};
			if (updates.displayName)
				metadataUpdates.display_name = updates.displayName;
			if (updates.avatar) metadataUpdates.avatar = updates.avatar;
			if (updates.role) metadataUpdates.role = updates.role;

			if (Object.keys(metadataUpdates).length > 0) {
				const { error: authError } = await supabase.auth.updateUser({
					data: metadataUpdates,
				});
				if (authError) {
					return toAuthFailure(authError, "profile-update");
				}
			}

			const dbUpdates: { updated_at: string; role?: string } = {
				updated_at: new Date().toISOString(),
			};
			if (updates.role) {
				dbUpdates.role = updates.role;
			}

			const { error } = await supabase
				.from("profiles")
				.update(dbUpdates)
				.eq("id", user.id);

			if (error) {
				return toAuthFailure(error, "profile-update");
			}

			// Update local state
			useAuthStore.getState().patchUser(updates);
			return { success: true };
		} catch (error) {
			return toAuthFailure(error, "profile-update");
		}
	};

	const hasPermission = (permission: string): boolean => {
		if (!user) return false;

		const userPermissions = permissions[user.role] || [];
		return (
			userPermissions.includes("*") || userPermissions.includes(permission)
		);
	};

	const isWarden = (): boolean => user?.role === "warden";
	const isPlayer = (): boolean => user?.role === "ascendant";

	const value: AuthContextType = {
		user,
		session,
		loading,
		signIn,
		signUp,
		signOut,
		requestPasswordReset,
		resendConfirmationEmail,
		beginPasswordChange,
		confirmPasswordChange,
		completePasswordRecovery,
		updateProfile,
		hasPermission,
		isWarden,
		isPlayer,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new AppError(
			"useAuth must be used within an AuthProvider",
			"INVALID_INPUT",
		);
	}
	return context;
}
