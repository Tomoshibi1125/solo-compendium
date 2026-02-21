import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { setupTestAccounts } from '@/test/utils/testUsers';

export default function TestUserSetup() {
  const [status, setStatus] = useState<'idle' | 'creating' | 'testing' | 'done' | 'error'>('idle');
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const handleSetup = async () => {
    setStatus('creating');
    setError('');
    
    try {
      const results = await setupTestAccounts();
      setResults(results);
      setStatus('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setStatus('error');
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Test User Setup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            This tool creates test user accounts in Supabase and verifies they can log in.
            <br />
            <br />
            <strong>Test Accounts:</strong>
            <br />
            DM: dm@test.com / test1234
            <br />
            Player: player@test.com / test1234
          </div>

          <Button 
            onClick={handleSetup}
            disabled={status === 'creating' || status === 'testing'}
            className="w-full"
          >
            {status === 'creating' ? 'Creating Users...' : 'Create Test Users'}
          </Button>

          {status === 'done' && results && (
            <Alert>
              <AlertDescription>
                <div className="space-y-2">
                  <div>
                    <strong>✅ User Creation:</strong>
                    <pre className="text-xs mt-1 p-2 bg-muted rounded">
                      {JSON.stringify(results.createResult, null, 2)}
                    </pre>
                  </div>
                  <div>
                    <strong>✅ DM Login Test:</strong>
                    <pre className="text-xs mt-1 p-2 bg-muted rounded">
                      {JSON.stringify(results.dmLoginResult, null, 2)}
                    </pre>
                  </div>
                  <div>
                    <strong>✅ Player Login Test:</strong>
                    <pre className="text-xs mt-1 p-2 bg-muted rounded">
                      {JSON.stringify(results.playerLoginResult, null, 2)}
                    </pre>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {status === 'error' && (
            <Alert variant="destructive">
              <AlertDescription>
                <strong>Error:</strong> {error}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
