import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth/authContext';

export default function Profile() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const displayName = useMemo(() => {
    if (!user) return 'Unknown';
    return user.displayName || user.email || 'User';
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <SystemWindow title="PROFILE & SETTINGS">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="text-xl font-semibold">{displayName}</div>
              <div className="text-sm text-muted-foreground">{user?.email}</div>
              <div className="text-sm text-muted-foreground">Role: {user?.role ?? 'unknown'}</div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={() => navigate('/auth?changeRole=true')}>Change Role</Button>
              <Button variant="outline" onClick={handleSignOut}>Sign out</Button>
            </div>
          </div>
        </SystemWindow>
      </div>
    </Layout>
  );
}
