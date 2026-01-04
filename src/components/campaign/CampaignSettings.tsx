import { useState, useEffect } from 'react';
import { Settings, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useCampaign } from '@/hooks/useCampaigns';
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
  const [name, setName] = useState(campaign?.name || '');
  const [description, setDescription] = useState(campaign?.description || '');
  const [isActive, setIsActive] = useState(campaign?.is_active ?? true);

  // Update when campaign data loads
  useState(() => {
    if (campaign) {
      setName(campaign.name);
      setDescription(campaign.description || '');
      setIsActive(campaign.is_active);
    }
  });

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

