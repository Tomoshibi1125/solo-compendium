import { AlertCircle, Lock, Shield, User } from "lucide-react";
import type { ReactNode } from "react";
import { isSupabaseConfigured } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth/authContext";

interface ProtectedRouteProps {
	children: ReactNode;
	requireDM?: boolean;
	allowGuest?: boolean;
}

// Enhanced loading component with better UX
const LoadingState = ({ message }: { message?: string }) => (
	<div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
		<div className="text-center space-y-4 max-w-md w-full">
			<div className="relative">
				<div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary mx-auto">
					<div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-primary/30 animate-pulse"></div>
				</div>
				<div className="mt-4 space-y-2">
					<h3 className="text-lg font-semibold text-foreground">
						{message || "Loading..."}
					</h3>
					<p className="text-sm text-muted-foreground">
						Preparing your experience
					</p>
				</div>
			</div>
		</div>
	</div>
);

// Enhanced access denied component
const AccessDenied = ({
	title,
	message,
	icon: Icon,
}: {
	title: string;
	message: string;
	icon: React.ComponentType<{ className?: string }>;
}) => (
	<div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-destructive/10 to-background p-4">
		<div className="text-center space-y-6 max-w-md w-full bg-background/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-destructive/20">
			<div className="flex justify-center mb-4">
				<div className="p-3 bg-destructive/10 rounded-full">
					<Icon className="h-8 w-8 text-destructive" />
				</div>
			</div>
			<div className="space-y-3">
				<h2 className="text-2xl font-bold text-foreground">{title}</h2>
				<p className="text-muted-foreground leading-relaxed">{message}</p>
			</div>
			<div className="pt-4 border-t border-border">
				<button
					type="button"
					onClick={() => window.history.back()}
					className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2"
				>
					Go Back
				</button>
			</div>
		</div>
	</div>
);

export function ProtectedRoute({
	children,
	requireDM = false,
	allowGuest,
}: ProtectedRouteProps) {
	const isE2E = import.meta.env.VITE_E2E === "true";
	const guestEnabled = import.meta.env.VITE_GUEST_ENABLED !== "false";
	const { user, loading, session } = useAuth();
	const isAuthenticated = !!user;
	const isDM = user?.role === "dm";
	const guestAllowed = allowGuest ?? guestEnabled;
	const hasStoredSession =
		typeof window !== "undefined" &&
		Object.keys(localStorage).some((key) => {
			if (key.includes("supabase.auth.token")) return true;
			if (key.includes("sb-") && key.endsWith("-auth-token")) return true;
			if (key.includes("auth-token")) return true;
			return false;
		});

	// E2E mode: Allow access for testing but still enforce role requirements
	// This enables proper testing of role-based access control
	if (isE2E) {
		// In E2E mode, we need to simulate authentication but still enforce DM requirements
		if (requireDM && !isDM) {
			return (
				<AccessDenied
					title="Access Denied"
					message="You need DM privileges to access this area. Please login with a DM account."
					icon={Lock}
				/>
			);
		}
		return <>{children}</>;
	}

	// If Supabase isn't configured, show helpful setup message
	if (!isSupabaseConfigured) {
		if (guestAllowed && (!requireDM || isDM)) {
			return <>{children}</>;
		}
		return (
			<AccessDenied
				title="Authentication Required"
				message="Please configure Supabase to enable authentication, or enable guest mode to continue."
				icon={AlertCircle}
			/>
		);
	}

	const shouldHoldForSession =
		!user &&
		(loading || (session && !user) || (!isAuthenticated && hasStoredSession));

	// Show enhanced loading state
	if (shouldHoldForSession) {
		return <LoadingState message="Authenticating..." />;
	}

	// Not authenticated - show helpful access denied
	if (!isAuthenticated) {
		if (guestAllowed) {
			return <>{children}</>;
		}
		return (
			<AccessDenied
				title="Authentication Required"
				message="Please sign in to access this area. Guest access is not enabled for this page."
				icon={User}
			/>
		);
	}

	// Require DM but user is not DM - show role-based access denied
	if (requireDM && !isDM) {
		return (
			<AccessDenied
				title="DM Access Required"
				message="This area requires Protocol Warden (DM) privileges. Please login with a DM account to continue."
				icon={Shield}
			/>
		);
	}

	return <>{children}</>;
}
