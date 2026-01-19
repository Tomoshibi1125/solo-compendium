import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { ShadowMonarchLogo } from '@/components/ui/ShadowMonarchLogo';
import { logger } from '@/lib/logger';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const normalizeRole = (value: string | null): 'dm' | 'player' | null => {
    if (value === 'dm' || value === 'player') return value;
    return null;
  };

  useEffect(() => {
    const handleAuthCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');

      if (error) {
        logger.error('Auth callback error:', error, errorDescription);
        navigate('/login?error=' + encodeURIComponent(errorDescription || error));
        return;
      }

      try {
        let session = (await supabase.auth.getSession()).data.session ?? null;
        let user = session?.user ?? null;

        if (!session && code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            throw error;
          }
          session = data.session ?? null;
          user = data.user ?? null;
        }

        if (!user) {
          const { data } = await supabase.auth.getUser();
          user = data.user ?? null;
        }

        if (!user) {
          navigate('/login?error=' + encodeURIComponent('Authentication failed'));
          return;
        }

        const { data: profileRows, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .limit(1);

        if (profileError) {
          logger.error('Error loading user profile:', profileError);
        }

        let role = profileRows?.[0]?.role ? normalizeRole(profileRows[0].role) : null;

        const pendingRole =
          typeof window !== 'undefined' ? normalizeRole(localStorage.getItem('pending-oauth-role')) : null;
        if (typeof window !== 'undefined') {
          localStorage.removeItem('pending-oauth-role');
        }

        if (!role && pendingRole) {
          const { error: roleError } = await supabase
            .from('profiles')
            .upsert(
              {
                id: user.id,
                role: pendingRole,
                updated_at: new Date().toISOString(),
              },
              { onConflict: 'id' }
            );

          if (roleError) {
            logger.error('Error setting role after OAuth sign-in:', roleError);
          } else {
            role = pendingRole;
          }
        }

        if (!role) {
          navigate('/auth');
          return;
        }

        navigate(role === 'dm' ? '/dm-tools' : '/player-tools');
      } catch (error) {
        logger.error('Error completing auth callback:', error);
        navigate('/login?error=' + encodeURIComponent('Authentication failed'));
      }
    };

    handleAuthCallback();
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <SystemWindow variant="arise">
          <div className="p-6">
            <div className="flex justify-center mb-6">
              <ShadowMonarchLogo size="md" variant="supreme" />
            </div>
            
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <h2 className="text-lg font-semibold text-foreground mb-2">
                Completing Authentication
              </h2>
              <p className="text-sm text-muted-foreground text-center">
                Please wait while we verify your credentials...
              </p>
            </div>
          </div>
        </SystemWindow>
      </div>
    </div>
  );
}
