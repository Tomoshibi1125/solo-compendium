import { useMemo, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/lib/auth/authContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, Camera, Save, LogOut, RefreshCw, Type } from 'lucide-react';
import { cn } from '@/lib/utils';

// Font size preference stored in localStorage
const FONT_SIZE_KEY = 'sa_ui_font_size';
const FONT_SIZES = [
  { label: 'Small', value: 'text-sm', cssVar: '14px' },
  { label: 'Default', value: 'text-base', cssVar: '16px' },
  { label: 'Large', value: 'text-lg', cssVar: '18px' },
];

export default function Profile() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayName = useMemo(
    () => user?.displayName || user?.email || 'User',
    [user],
  );

  // Editable state
  const [nameInput, setNameInput] = useState(displayName);
  const [savingName, setSavingName] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    (user as unknown as Record<string, unknown>)?.user_metadata
      ? ((user as unknown as Record<string, unknown>).user_metadata as Record<string, string>).avatar_url ?? null
      : null,
  );
  const [selectedFontSize, setSelectedFontSize] = useState<string>(
    () => localStorage.getItem(FONT_SIZE_KEY) || 'text-base',
  );

  const handleSaveName = async () => {
    if (!nameInput.trim()) return;
    setSavingName(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { display_name: nameInput.trim() },
      });
      if (error) throw error;
      toast({ title: 'Display name updated', description: `Now showing as "${nameInput.trim()}"` });
    } catch (err) {
      toast({
        title: 'Failed to update name',
        description: err instanceof Error ? err.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setSavingName(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Avatar must be under 2 MB.', variant: 'destructive' });
      return;
    }

    // Preview immediately
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result as string;
      setAvatarPreview(dataUrl);

      // Save base64 avatar to user metadata
      try {
        const { error } = await supabase.auth.updateUser({
          data: { avatar_url: dataUrl },
        });
        if (error) throw error;
        toast({ title: 'Avatar updated' });
      } catch (err) {
        toast({
          title: 'Failed to save avatar',
          description: err instanceof Error ? err.message : 'Unknown error',
          variant: 'destructive',
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFontSizeChange = (value: string) => {
    setSelectedFontSize(value);
    localStorage.setItem(FONT_SIZE_KEY, value);
    const size = FONT_SIZES.find((f) => f.value === value);
    if (size) {
      document.documentElement.style.setProperty('--ui-font-size', size.cssVar);
    }
    toast({ title: 'Font size updated', description: `UI text size set to ${FONT_SIZES.find(f => f.value === value)?.label}` });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-2xl space-y-6">
        <h1 className="text-3xl font-bold">Profile & Settings</h1>

        {/* Avatar + Name */}
        <SystemWindow title="IDENTITY">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="relative group shrink-0 w-20 h-20 rounded-full overflow-hidden border-2 border-border hover:border-primary/60 transition-colors"
            >
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <User className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
              </div>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
              aria-label="Upload avatar"
            />

            {/* Name */}
            <div className="flex-1 w-full space-y-3">
              <div className="space-y-1">
                <Label htmlFor="display-name">Display Name</Label>
                <div className="flex gap-2">
                  <Input
                    id="display-name"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                    placeholder="Your display name"
                  />
                  <Button
                    onClick={handleSaveName}
                    disabled={savingName || nameInput.trim() === displayName}
                    size="sm"
                  >
                    {savingName ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <div className="text-sm text-muted-foreground space-y-0.5">
                <p>{user?.email}</p>
                <p className="capitalize">Role: {user?.role ?? 'player'}</p>
              </div>
            </div>
          </div>
        </SystemWindow>

        {/* Appearance */}
        <SystemWindow title="APPEARANCE">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-muted-foreground" />
                <Label>UI Font Size</Label>
              </div>
              <div className="flex gap-2">
                {FONT_SIZES.map((size) => (
                  <button
                    key={size.value}
                    type="button"
                    onClick={() => handleFontSizeChange(size.value)}
                    className={cn(
                      'flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-colors',
                      selectedFontSize === size.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-muted/20 text-muted-foreground hover:border-primary/40',
                    )}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Adjusts the base UI font size. Saved across sessions.
              </p>
            </div>
          </div>
        </SystemWindow>

        {/* Account Actions */}
        <SystemWindow title="ACCOUNT">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={() => navigate('/auth?changeRole=true')} variant="outline">
              Change Role
            </Button>
            <Button variant="destructive" onClick={handleSignOut} className="gap-2">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </SystemWindow>
      </div>
    </Layout>
  );
}
