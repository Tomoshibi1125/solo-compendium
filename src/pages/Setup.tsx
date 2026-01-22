import { useMemo } from 'react';
import { AlertTriangle, Copy, RefreshCw } from 'lucide-react';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getRuntimeEnvValue } from '@/lib/runtimeEnv';

function getMissingEnvVars(): string[] {
  const missing: string[] = [];
  const url = getRuntimeEnvValue('VITE_SUPABASE_URL');
  const key = getRuntimeEnvValue('VITE_SUPABASE_PUBLISHABLE_KEY') || getRuntimeEnvValue('VITE_SUPABASE_ANON_KEY');
  if (!url || url.trim() === '') missing.push('VITE_SUPABASE_URL');
  if (!key || key.trim() === '') {
    missing.push('VITE_SUPABASE_PUBLISHABLE_KEY (or VITE_SUPABASE_ANON_KEY)');
  }
  return missing;
}

export default function Setup() {
  const { toast } = useToast();
  const missing = useMemo(() => getMissingEnvVars(), []);

  const envTemplate = useMemo(() => {
    const lines = [
      '# Local development',
      'VITE_SUPABASE_URL=https://your-project.supabase.co',
      'VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key',
      '# Or: VITE_SUPABASE_ANON_KEY=your-anon-key',
      '',
      '# Optional',
      '# VITE_SENTRY_DSN=',
      '# VITE_ANALYTICS_ENABLED=false',
    ];
    return lines.join('\n');
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="w-full max-w-3xl space-y-6">
        <SystemWindow title="SETUP REQUIRED" variant="alert">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-destructive mt-0.5" />
              <div>
                <h1 className="text-xl font-semibold">Supabase configuration missing</h1>
                <p className="text-sm text-muted-foreground">
                  This app requires Supabase to power accounts, characters, and the compendium. Add the required env vars
                  and reload.
                </p>
              </div>
            </div>

            {missing.length > 0 && (
              <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3">
                <div className="text-sm font-medium mb-2">Missing environment variables</div>
                <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                  {missing.map((name) => (
                    <li key={name}>
                      <code className="text-foreground">{name}</code>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-medium">Create `.env.local` in the repo root</div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    await navigator.clipboard.writeText(envTemplate);
                    toast({ title: 'Copied', description: 'Env template copied to clipboard.' });
                  }}
                  className="gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy template
                </Button>
              </div>
              <pre className="text-xs bg-muted/30 border rounded-md p-3 overflow-auto">
                {envTemplate}
              </pre>
            </div>

            <div className="space-y-2 text-sm">
              <div className="font-medium">Next steps</div>
              <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">
                <li>Create a Supabase project and set the env vars above.</li>
                <li>Apply database migrations (Supabase CLI or Dashboard SQL editor).</li>
                <li>Reload the app.</li>
                <li>For runtime config, update <code>public/runtime-env.js</code> before serving.</li>
              </ol>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Reload
              </Button>
            </div>

            <div className="text-xs text-muted-foreground">
              See repository docs for full setup:
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li><code>docs/DEPLOY_CHECKLIST.md</code></li>
                <li><code>docs/DEPLOYMENT_READINESS.md</code></li>
                <li><code>scripts/SUPABASE_SETUP.md</code></li>
              </ul>
            </div>
          </div>
        </SystemWindow>

        <p className="text-xs text-muted-foreground text-center">
          Tip: once configured, you can return here anytime at <code>/setup</code>.
        </p>
      </div>
    </div>
  );
}


