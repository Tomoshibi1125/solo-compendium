import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import { toast } from '@/hooks/use-toast';

export interface OAuthProvider {
  id: 'google' | 'apple';
  name: string;
  icon: string;
  color: string;
}

const PROVIDER_OPTIONS: Record<OAuthProvider['id'], { queryParams?: Record<string, string>; scopes?: string }> = {
  google: {
    queryParams: {
      access_type: 'offline',
      prompt: 'consent',
    },
    scopes: 'email profile',
  },
  apple: {
    scopes: 'name email',
  },
};

export const OAUTH_PROVIDERS: OAuthProvider[] = [
  {
    id: 'google',
    name: 'Google',
    icon: 'G',
    color: 'bg-blue-500 hover:bg-blue-600',
  },
  {
    id: 'apple',
    name: 'Apple',
    icon: 'A',
    color: 'bg-gray-800 hover:bg-gray-900',
  },
];

export interface UseOAuthReturn {
  isLoading: boolean;
  signInWithProvider: (provider: OAuthProvider) => Promise<void>;
  signOut: () => Promise<void>;
  user: User | null;
  error: string | null;
}

export function useOAuth(): UseOAuthReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get initial user session
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        logger.error('Error getting user:', error);
      }
    };

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          setError(null);
          
          // Show welcome message for OAuth sign-ins
          const provider = session.user.app_metadata?.provider;
          if (provider && provider !== 'email') {
            const providerName = OAUTH_PROVIDERS.find(p => p.id === provider)?.name || provider;
            toast({
              title: `Welcome, Ascendant!`,
              description: `You've successfully signed in with ${providerName}`,
            });
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setError(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signInWithProvider = async (provider: OAuthProvider) => {
    setIsLoading(true);
    setError(null);

    try {
      const providerOptions = PROVIDER_OPTIONS[provider.id];
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider.id,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          ...(providerOptions?.queryParams ? { queryParams: providerOptions.queryParams } : {}),
          ...(providerOptions?.scopes ? { scopes: providerOptions.scopes } : {}),
        },
      });

      if (error) {
        throw error;
      }

      // The redirect will happen automatically
    } catch (error) {
      logger.error('OAuth sign in error:', error);
      setError(error instanceof Error ? error.message : 'Failed to sign in');
      toast({
        title: 'Sign In Failed',
        description: `Failed to sign in with ${provider.name}. Please try again.`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }

      toast({
        title: 'Signed Out',
        description: 'You have been successfully signed out.',
      });
    } catch (error) {
      logger.error('Sign out error:', error);
      toast({
        title: 'Sign Out Failed',
        description: 'Failed to sign out. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    signInWithProvider,
    signOut,
    user,
    error,
  };
}

