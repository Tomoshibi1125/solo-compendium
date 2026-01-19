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

      if (code) {
        try {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          
          if (error) {
            throw error;
          }

          if (data.session) {
            // Successfully authenticated
            const user = data.user;
            const provider = user?.app_metadata?.provider;
            
            logger.debug('User authenticated successfully:', {
              id: user?.id,
              email: user?.email,
              provider,
            });

            // Redirect to the appropriate page based on user state
            navigate('/compendium');
          }
        } catch (error) {
          logger.error('Error exchanging code for session:', error);
          navigate('/login?error=' + encodeURIComponent('Authentication failed'));
        }
      } else {
        // No code or error, redirect to login
        navigate('/login');
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
