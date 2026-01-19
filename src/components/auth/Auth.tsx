import { useState, useEffect } from 'react';
import { Auth as SupabaseAuth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { ShadowMonarchLogo } from '@/components/ui/ShadowMonarchLogo';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Crown, Sword, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUpdateProfile, useProfile } from '@/hooks/useProfile';
import { cn } from '@/lib/utils';
import { logger } from '@/lib/logger';
import { OAuthButtons } from './OAuthButton';
import { useOAuth } from '@/hooks/useOAuth';

export function Auth() {
  const navigate = useNavigate();
  const [authView, setAuthView] = useState<'sign_up' | 'sign_in'>('sign_in');
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'dm' | 'player' | null>(null);
  const [isSignup, setIsSignup] = useState(false);
  const updateProfile = useUpdateProfile();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const isConfigured = isSupabaseConfigured;
  const isE2E = import.meta.env.VITE_E2E === 'true';
  const { isLoading: oauthLoading, signInWithProvider } = useOAuth();

  // Check auth state and profile
  useEffect(() => {
    if (!isConfigured || isE2E) return;

    const checkAuthState = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        if (!profileLoading) {
          if (!profile) {
            // User is authenticated but has no profile - show role selection
            // This can happen for existing users before the migration
            setShowRoleSelection(true);
            setIsSignup(false); // Not a new signup, just missing profile
          } else {
            // Check if user came here to change role (via query param or direct navigation)
            const urlParams = new URLSearchParams(window.location.search);
            const changeRole = urlParams.get('changeRole') === 'true';
            
            if (changeRole) {
              // User wants to change role - show role selection with current role pre-selected
              setShowRoleSelection(true);
              setSelectedRole(profile.role);
              setIsSignup(false);
            } else {
              // User has profile and doesn't want to change - redirect to home
              navigate('/');
            }
          }
        }
      }
    };

    checkAuthState();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // Supabase JS v2 AuthChangeEvent does not include SIGNED_UP.
        // Detect sign-up via the current auth view + a "first sign-in" heuristic.
        const createdAt = session.user.created_at ? new Date(session.user.created_at).getTime() : null;
        const lastSignInAt = session.user.last_sign_in_at ? new Date(session.user.last_sign_in_at).getTime() : null;
        const isNewSignup =
          authView === 'sign_up' ||
          (createdAt && lastSignInAt && Math.abs(createdAt - lastSignInAt) < 60_000);

        if (isNewSignup) {
          setIsSignup(true);
          setShowRoleSelection(true);
          return;
        }

        // Existing user signing in - check if they have a profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        if (!profileData) {
          // No profile exists - show role selection
          setShowRoleSelection(true);
          setIsSignup(false);
        } else {
          // Has profile - redirect to home (don't show role selection for existing users)
          navigate('/');
        }
      } else if (event === 'SIGNED_OUT') {
        setShowRoleSelection(false);
        setSelectedRole(null);
        setIsSignup(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [profile, profileLoading, navigate, authView, isConfigured, isE2E]);

  // Handle role selection
  const handleRoleSelect = async () => {
    if (!selectedRole) return;

    try {
      await updateProfile.mutateAsync({ role: selectedRole });
    } catch (error) {
      logger.error("Error setting role:", error);
      // Add user notification here if needed
    }
      // Navigation will happen automatically via the useEffect when profile updates
  };

  if (isE2E) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/5 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <SystemWindow variant="arise" title="AUTH (E2E)" className="text-center">
            <div className="p-8 space-y-4">
              <div className="flex justify-center">
                <ShadowMonarchLogo size="md" variant="supreme" />
              </div>
              <div>
                <h2 className="font-arise text-2xl font-bold gradient-text-arise mb-2">
                  Authentication in test mode
                </h2>
                <p className="text-muted-foreground font-heading text-sm">
                  E2E mode bypasses live auth to keep test runs deterministic.
                </p>
              </div>
              <Button onClick={() => navigate('/')} className="w-full" size="lg">
                Return Home
              </Button>
            </div>
          </SystemWindow>
        </div>
      </div>
    );
  }

  if (!isConfigured) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/5 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <SystemWindow variant="arise" title="AUTH SETUP" className="text-center">
            <div className="p-8 space-y-4">
              <div className="flex justify-center">
                <ShadowMonarchLogo size="md" variant="supreme" />
              </div>
              <div>
                <h2 className="font-arise text-2xl font-bold gradient-text-arise mb-2">
                  Supabase configuration required
                </h2>
                <p className="text-muted-foreground font-heading text-sm">
                  Set <span className="font-medium">VITE_SUPABASE_URL</span> and{' '}
                  <span className="font-medium">VITE_SUPABASE_PUBLISHABLE_KEY</span> to enable authentication.
                </p>
              </div>
              <Button onClick={() => navigate('/setup')} className="w-full" size="lg">
                Go to Setup
              </Button>
            </div>
          </SystemWindow>
        </div>
      </div>
    );
  }

  // Role selection view
  if (showRoleSelection) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/5 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <SystemWindow variant="arise" className="text-center">
            <div className="p-8 space-y-6">
              <div className="flex justify-center mb-4">
                <ShadowMonarchLogo size="md" variant="supreme" />
              </div>
              <h2 className="font-arise text-2xl font-bold gradient-text-arise mb-2">
                {isSignup ? 'Choose Your Role' : profile ? 'Change Your Role' : 'Select Your Role'}
              </h2>
              <p className="text-muted-foreground font-heading text-sm mb-6">
                {isSignup 
                  ? 'Select your role to continue. You can change this later in your profile.'
                  : profile
                  ? 'Select a new role. This will update your account permissions.'
                  : 'Choose which role you want to use for this session.'}
              </p>

              <RadioGroup
                value={selectedRole ?? ''}
                onValueChange={(value) => setSelectedRole(value as 'dm' | 'player')}
                className="space-y-4"
              >
                <Label
                  htmlFor="role-player"
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all",
                    selectedRole === 'player'
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <RadioGroupItem value="player" id="role-player" className="mt-0" />
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Sword className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <div className="font-heading font-semibold">Hunter (Player)</div>
                      <div className="text-sm text-muted-foreground">
                        Join campaigns and create characters
                      </div>
                    </div>
                  </div>
                </Label>

                <Label
                  htmlFor="role-dm"
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all",
                    selectedRole === 'dm'
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <RadioGroupItem value="dm" id="role-dm" className="mt-0" />
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Crown className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <div className="font-heading font-semibold">Gate Master (DM)</div>
                      <div className="text-sm text-muted-foreground">
                        Create campaigns and access DM tools
                      </div>
                    </div>
                  </div>
                </Label>

              </RadioGroup>

              <Button
                onClick={handleRoleSelect}
                disabled={!selectedRole || updateProfile.isPending}
                className="w-full"
                size="lg"
              >
                {updateProfile.isPending ? 'Setting up...' : 'Continue'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </SystemWindow>
        </div>
      </div>
    );
  }

  // Auth UI view
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <SystemWindow variant="arise">
          <div className="p-6">
            <div className="flex justify-center mb-6">
              <ShadowMonarchLogo size="md" variant="supreme" />
            </div>
            
            {/* OAuth Buttons */}
            <div className="mb-6">
              <OAuthButtons 
                isLoading={oauthLoading}
                onSignIn={signInWithProvider}
                className="mb-4"
              />
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-background px-2 text-muted-foreground">or continue with email</span>
                </div>
              </div>
            </div>

            <SupabaseAuth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: 'hsl(var(--primary))',
                      brandAccent: 'hsl(var(--primary))',
                    },
                  },
                },
                className: {
                  anchor: 'text-primary hover:text-primary/80',
                  button: 'bg-primary hover:bg-primary/90',
                  input: 'bg-background border-border',
                  label: 'text-foreground',
                  message: 'text-muted-foreground',
                },
              }}
              providers={[]}
              view={authView}
              redirectTo={window.location.origin}
              onlyThirdPartyProviders={false}
              queryParams={{
                access_type: 'offline',
                prompt: 'consent',
              }}
              socialLayout="vertical"
            />
            <div className="mt-4 text-center">
              <button
                onClick={() => setAuthView(authView === 'sign_in' ? 'sign_up' : 'sign_in')}
                className="text-sm text-primary hover:underline font-heading"
              >
                {authView === 'sign_in'
                  ? "Don't have an account? Sign up"
                  : 'Already have an account? Sign in'}
              </button>
            </div>
          </div>
        </SystemWindow>
      </div>
    </div>
  );
}

