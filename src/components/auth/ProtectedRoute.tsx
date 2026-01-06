import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useIsDM } from '@/hooks/useCampaigns';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireDM?: boolean;
}

export function ProtectedRoute({ children, requireDM = false }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const { data: isDM = false, isLoading: dmLoading } = useIsDM();

  useEffect(() => {
    if (!isSupabaseConfigured) {
      // Setup/guest mode: don't run auth checks.
      return;
    }

    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session?.user);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // If Supabase isn't configured, the app is running in setup mode.
  // Redirect to setup instead of looping auth checks.
  if (!isSupabaseConfigured) {
    return <Navigate to="/setup" replace />;
  }

  // Show loading state
  if (isAuthenticated === null || (requireDM && dmLoading)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to auth
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Require DM but user is not DM - redirect to home
  if (requireDM && !isDM) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

