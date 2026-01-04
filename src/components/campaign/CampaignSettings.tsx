import { useState, useEffect } from 'react';
import { Save, Loader2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useCampaign, useHasDMAccess } from '@/hooks/useCampaigns';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CampaignSettingsProps {
  campaignId: string;
}

export function CampaignSettings({ campaignId }: CampaignSettingsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: campaign } = useCampaign(campaignId);
  const { data: hasDMAccess, isLoading: loadingAccess } = useHasDMAccess(campaignId);
  const [name, setName] = useState(campaign?.name || '');
  const [description, setDescription] = useState(campaign?.description || '');
  const [isActive, setIsActive] = useState(campaign?.is_active ?? true);

  // Update when campaign data loads
  useEffect(() => {
    if (campaign) {
      setName(campaign.name);
      setDescription(campaign.description || '');
      setIsActive(campaign.is_active);
    }
  }, [campaign]);

  const updateCampaign = useMutation({
    mutationFn: async (updates: { name?: string; description?: string; is_active?: boolean }) => {
      const { error } = await supabase
        .from('campaigns')
        .update(updates)
        .eq('id', campaignId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns', campaignId] });
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast({
        title: 'Campaign updated',
        description: 'Your changes have been saved.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to update campaign',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleSave = () => {
    if (!name.trim()) {
      toast({
        title: 'Name required',
        description: 'Campaign name cannot be empty.',
        variant: 'destructive',
      });
      return;
    }

    updateCampaign.mutate({
      name: name.trim(),
      description: description.trim() || null,
      is_active: isActive,
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
            Only the Shadow Monarch (DM) can access campaign settings.
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

