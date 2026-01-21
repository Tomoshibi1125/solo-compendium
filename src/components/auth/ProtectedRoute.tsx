import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth/authContext';
import { isSupabaseConfigured } from '@/integrations/supabase/client';

interface ProtectedRouteProps {
  children: ReactNode;
  requireDM?: boolean;
  allowGuest?: boolean;
}

export function ProtectedRoute({ children, requireDM = false, allowGuest }: ProtectedRouteProps) {
  const isE2E = import.meta.env.VITE_E2E === 'true';
  const guestEnabled = import.meta.env.VITE_GUEST_ENABLED !== 'false';
  const { user, loading, session } = useAuth();
  const isAuthenticated = !!user;
  const isDM = user?.role === 'dm';
  const guestAllowed = allowGuest ?? guestEnabled;
  const hasStoredSession =
    typeof window !== 'undefined' &&
    Object.keys(localStorage).some((key) => key.includes('auth-token') || key.includes('supabase.auth.token'));

  if (isE2E) {
    return <>{children}</>;
  }

  // If Supabase isn't configured, the app is running in setup mode.
  // Redirect to setup instead of looping auth checks.
  if (!isSupabaseConfigured) {
    return <Navigate to="/setup" replace />;
  }

  const shouldHoldForSession =
    !user && (loading || (session && !user) || (!isAuthenticated && hasStoredSession));

  // Show loading state
  if (shouldHoldForSession) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - allow guest access if enabled, otherwise redirect to auth
  if (!isAuthenticated) {
    if (guestAllowed) {
      return <>{children}</>;
    }
    return <Navigate to="/auth" replace />;
  }

  // Require DM but user is not DM - redirect to home
  if (requireDM && !isDM) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

