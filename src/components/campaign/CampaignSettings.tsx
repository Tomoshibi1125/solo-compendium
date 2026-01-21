import { useState, useEffect } from 'react';
import { Save, Loader2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCampaign, useHasDMAccess, useUpdateCampaign } from '@/hooks/useCampaigns';
import { useToast } from '@/hooks/use-toast';
import type { Json } from '@/integrations/supabase/types';
import { getLevelingMode, type LevelingMode } from '@/lib/campaignSettings';

interface CampaignSettingsProps {
  campaignId: string;
}

export function CampaignSettings({ campaignId }: CampaignSettingsProps) {
  const { toast } = useToast();
  const { data: campaign } = useCampaign(campaignId);
  const { data: hasDMAccess, isLoading: loadingAccess } = useHasDMAccess(campaignId);
  const [name, setName] = useState(campaign?.name || '');
  const [description, setDescription] = useState(campaign?.description || '');
  const [isActive, setIsActive] = useState(campaign?.is_active ?? true);
  const [levelingMode, setLevelingMode] = useState<LevelingMode>(getLevelingMode(campaign?.settings));

  // Update when campaign data loads
  useEffect(() => {
    if (campaign) {
      setName(campaign.name);
      setDescription(campaign.description || '');
      setIsActive(campaign.is_active);
      setLevelingMode(getLevelingMode(campaign.settings));
    }
  }, [campaign]);

  const updateCampaign = useUpdateCampaign();

  const handleSave = () => {
    if (!name.trim()) {
      toast({
        title: 'Name required',
        description: 'Campaign name cannot be empty.',
        variant: 'destructive',
      });
      return;
    }
    if (!campaign) {
      toast({
        title: 'Campaign unavailable',
        description: 'Campaign details are still loading. Try again shortly.',
        variant: 'destructive',
      });
      return;
    }

    const baseSettings =
      campaign.settings &&
      typeof campaign.settings === 'object' &&
      !Array.isArray(campaign.settings)
        ? (campaign.settings as Record<string, Json>)
        : {};

    updateCampaign.mutate({
      campaignId,
      updates: {
        name: name.trim(),
        description: description.trim() || null,
        is_active: isActive,
        settings: { ...baseSettings, leveling_mode: levelingMode },
      },
    });
  };

  if (loadingAccess) {
    return (
      <SystemWindow title="CAMPAIGN SETTINGS" className="h-[400px] flex flex-col">
        <div className="flex items-center justify-center flex-1">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </SystemWindow>
    );
  }

  if (!hasDMAccess) {
    return (
      <SystemWindow title="CAMPAIGN SETTINGS" variant="alert" className="h-[400px] flex flex-col">
        <div className="flex flex-col items-center justify-center flex-1 text-center">
          <Shield className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
          <p className="text-muted-foreground font-heading mb-2">
            Access Restricted
          </p>
          <p className="text-sm text-muted-foreground">
            Only the Protocol Warden can access campaign settings.
          </p>
        </div>
      </SystemWindow>
    );
  }

  if (!campaign) return null;

  return (
    <SystemWindow title="CAMPAIGN SETTINGS" className="h-[400px] flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-4">
        <div>
          <Label htmlFor="campaign-name">Campaign Name</Label>
          <Input
            id="campaign-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="campaign-description">Description</Label>
          <Textarea
            id="campaign-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1"
            rows={4}
          />
        </div>
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
          <div>
            <Label htmlFor="campaign-active">Campaign Active</Label>
            <p className="text-xs text-muted-foreground">
              Inactive campaigns cannot accept new members
            </p>
          </div>
          <Switch
            id="campaign-active"
            checked={isActive}
            onCheckedChange={setIsActive}
          />
        </div>
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
          <div>
            <Label htmlFor="campaign-leveling-mode">Leveling Mode</Label>
            <p className="text-xs text-muted-foreground">
              Choose XP or milestone advancement for this campaign
            </p>
          </div>
          <Select value={levelingMode} onValueChange={(value) => setLevelingMode(value as LevelingMode)}>
            <SelectTrigger id="campaign-leveling-mode" className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="milestone">Milestone</SelectItem>
              <SelectItem value="xp">XP</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="pt-4 border-t border-border">
        <Button
          onClick={handleSave}
          className="w-full"
          disabled={updateCampaign.isPending}
        >
          {updateCampaign.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </SystemWindow>
  );
}


