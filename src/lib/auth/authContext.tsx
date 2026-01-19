/**
 * Authentication Context
 * Role-based authentication for Solo Compendium
 */

import React, { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AppError } from '@/lib/appError';
import { error as logError } from '@/lib/logger';

export type UserRole = 'dm' | 'player';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  displayName?: string;
  avatar?: string;
  createdAt: string;
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string, role: UserRole) => Promise<{ error?: string; success?: boolean }>;
  signUp: (email: string, password: string, displayName: string, role: UserRole) => Promise<{ error?: string; success?: boolean }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<AuthUser>) => Promise<{ error?: string; success?: boolean }>;
  hasPermission: (permission: string) => boolean;
  isDM: () => boolean;
  isPlayer: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const normalizeRole = (value?: string | null): UserRole => {
  if (value === 'dm' || value === 'admin') return 'dm';
  if (value === 'player') return 'player';
  return 'player';
};

const buildFallbackUser = (authUser: User): AuthUser => {
  const metadata = authUser.user_metadata || {};
  const displayName =
    typeof metadata.display_name === 'string'
      ? metadata.display_name
      : typeof metadata.full_name === 'string'
        ? metadata.full_name
        : undefined;
  const avatar =
    typeof metadata.avatar_url === 'string'
      ? metadata.avatar_url
      : typeof metadata.avatar === 'string'
        ? metadata.avatar
        : undefined;

  return {
    id: authUser.id,
    email: authUser.email ?? '',
    role: normalizeRole(typeof metadata.role === 'string' ? metadata.role : undefined),
    displayName,
    avatar,
    createdAt: authUser.created_at ?? new Date().toISOString(),
  };
};
const toProfileRole = (role: UserRole): 'dm' | 'player' => role;
const withTimeout = async <T,>(promise: PromiseLike<T>, timeoutMs: number, label: string): Promise<T> => {
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
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Role-based permissions
  const permissions = {
    dm: [
      'view:dm_tools',
      'manage:campaigns',
      'manage:players',
      'generate:art',
      'manage:audio',
      'view:compendium',
      'edit:compendium',
      'manage:quests',
      'view:analytics'
    ],
    player: [
      'view:player_tools',
      'view:character_sheet',
      'view:compendium',
      'generate:character_art',
      'view:quests',
      'participate:campaign'
    ]
  };

  const fetchUserProfile = useCallback(async (authUser: User) => {
    const fallbackUser = buildFallbackUser(authUser);

    try {
      const { data, error } = await withTimeout(
        supabase
          .from('profiles')
          .select('id, role, created_at')
          .eq('id', authUser.id)
          .single(),
        8000,
        'Fetch profile'
      );

      if (error) {
        logError('Error fetching user profile:', error);
        setUser(fallbackUser);
        return;
      }

      if (data) {
        const metadataRole = typeof authUser.user_metadata?.role === 'string' ? authUser.user_metadata.role : undefined;
        setUser({
          id: data.id,
          email: authUser.email ?? '',
          role: normalizeRole(metadataRole ?? data.role),
          displayName: fallbackUser.displayName,
          avatar: fallbackUser.avatar,
          createdAt: data.created_at,
        });
      } else {
        setUser(fallbackUser);
      }
    } catch (error) {
      logError('Error fetching user profile:', error);
      setUser(fallbackUser);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Get initial session
    withTimeout(supabase.auth.getSession(), 8000, 'Load session')
      .then(({ data: { session } }) => {
        setSession(session);
        if (session?.user) {
          fetchUserProfile(session.user);
        } else {
          setLoading(false);
        }
      })
      .catch((error) => {
        logError('Error loading session:', error);
        setSession(null);
        setUser(null);
        setLoading(false);
      });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      if (session?.user) {
        setLoading(true);
        try {
          await withTimeout(fetchUserProfile(session.user), 8000, 'Sync profile');
        } catch (error) {
          logError('Error syncing user profile:', error);
          setLoading(false);
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchUserProfile]);

  useEffect(() => {
    if (!session?.user || user) return;
    setUser(buildFallbackUser(session.user));
    setLoading(false);
  }, [session, user]);

  const signIn = async (email: string, password: string, role: UserRole) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      if (data.user) {
        // Verify role matches
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        const expectedRole = toProfileRole(role);
        const metadataRole =
          typeof data.user.user_metadata?.role === 'string' ? data.user.user_metadata.role : undefined;
        const actualRole = normalizeRole(profile?.role ?? metadataRole);
        const roleMatches = actualRole === expectedRole;

        if (profileError || !roleMatches) {
          await supabase.auth.signOut();
          return { error: 'Invalid role for this account' };
        }
      }

      return { success: true };
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  };

  const signUp = async (email: string, password: string, displayName: string, role: UserRole) => {
    try {
      // Create auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
            role: role
          }
        }
      });

      if (error) {
        return { error: error.message };
      }

      if (data.user) {
        // Ensure profile exists and role is set; profile row is created by trigger.
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert(
            {
              id: data.user.id,
              role: toProfileRole(role),
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'id' }
          );

        if (profileError) {
          return { error: 'Failed to create user profile' };
        }
      }

      return { success: true };
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const updateProfile = async (updates: Partial<AuthUser>) => {
    if (!user) return { error: 'No user logged in' };

    try {
      const metadataUpdates: Record<string, unknown> = {};
      if (updates.displayName) metadataUpdates.display_name = updates.displayName;
      if (updates.avatar) metadataUpdates.avatar = updates.avatar;

      if (Object.keys(metadataUpdates).length > 0) {
        const { error: authError } = await supabase.auth.updateUser({
          data: metadataUpdates,
        });
        if (authError) {
          return { error: authError.message };
        }
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        return { error: error.message };
      }

      // Update local state
      setUser(prev => (prev ? { ...prev, ...updates } : null));
      return { success: true };
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    
    const userPermissions = permissions[user.role] || [];
    return userPermissions.includes('*') || userPermissions.includes(permission);
  };

  const isDM = (): boolean => user?.role === 'dm';
  const isPlayer = (): boolean => user?.role === 'player';

  const value: AuthContextType = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    hasPermission,
    isDM,
    isPlayer
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new AppError('useAuth must be used within an AuthProvider', 'INVALID_INPUT');
  }
  return context;
}

// Permission-based component wrapper
// eslint-disable-next-line react-refresh/only-export-components
export function withPermission(permission: string, Component: React.ComponentType<any>) {
  return function PermissionWrapper(props: any) {
    const { hasPermission } = useAuth();
    
    if (!hasPermission(permission)) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Access Denied
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              You don't have permission to access this feature.
            </p>
          </div>
        </div>
      );
    }
    
    return <Component {...props} />;
  };
}
