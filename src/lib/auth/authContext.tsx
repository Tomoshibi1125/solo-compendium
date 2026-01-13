/**
 * Authentication Context
 * Role-based authentication for Solo Compendium
 */

import React, { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AppError } from '@/lib/appError';
import { error as logError } from '@/lib/logger';

export type UserRole = 'dm' | 'player' | 'admin';

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
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const normalizeRole = (value?: string | null): UserRole =>
  value === 'admin' || value === 'dm' || value === 'player' ? value : 'player';
const toProfileRole = (role: UserRole): 'dm' | 'player' => (role === 'admin' ? 'dm' : role);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Role-based permissions
  const permissions = {
    admin: ['*'], // All permissions
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

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, role, created_at')
        .eq('id', authUser.id)
        .single();

      if (error) {
        logError('Error fetching user profile:', error);
        setUser({
          id: authUser.id,
          email: authUser.email ?? '',
          role: normalizeRole(typeof metadata.role === 'string' ? metadata.role : undefined),
          displayName,
          avatar,
          createdAt: authUser.created_at ?? new Date().toISOString(),
        });
        setLoading(false);
        return;
      }

      if (data) {
        const metadataRole = typeof metadata.role === 'string' ? metadata.role : undefined;
        setUser({
          id: data.id,
          email: authUser.email ?? '',
          role: metadataRole === 'admin' ? 'admin' : normalizeRole(data.role),
          displayName,
          avatar,
          createdAt: data.created_at,
        });
      }
    } catch (error) {
      logError('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      if (session?.user) {
        await fetchUserProfile(session.user);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchUserProfile]);

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
        const roleMatches =
          role === 'admin'
            ? metadataRole === 'admin' || profile?.role === expectedRole
            : profile?.role === expectedRole;

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

  const isDM = (): boolean => user?.role === 'dm' || user?.role === 'admin';
  const isPlayer = (): boolean => user?.role === 'player';
  const isAdmin = (): boolean => user?.role === 'admin';

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
    isPlayer,
    isAdmin
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
