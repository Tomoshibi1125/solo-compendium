import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Users, 
  Copy, 
  ExternalLink, 
  Loader2,
  Crown,
  UserPlus,
  LogOut
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useMyCampaigns, useJoinedCampaigns, useCreateCampaign, useLeaveCampaign } from '@/hooks/useCampaigns';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Campaigns = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [campaignName, setCampaignName] = useState('');
  const [campaignDescription, setCampaignDescription] = useState('');

  const { data: myCampaigns = [], isLoading: loadingMy } = useMyCampaigns();
  const { data: joinedCampaigns = [], isLoading: loadingJoined } = useJoinedCampaigns();
  const createCampaign = useCreateCampaign();
  const leaveCampaign = useLeaveCampaign();

  const handleCreateCampaign = async () => {
    if (!campaignName.trim()) {
      toast({
        title: 'Name required',
        description: 'Please enter a campaign name.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const campaignId = await createCampaign.mutateAsync({
        name: campaignName,
        description: campaignDescription || undefined,
      });
      setCreateDialogOpen(false);
      setCampaignName('');
      setCampaignDescription('');
      navigate(`/campaigns/${campaignId}`);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleCopyShareLink = (shareCode: string) => {
    const shareUrl = `${window.location.origin}/campaigns/join/${shareCode}`;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: 'Share link copied!',
      description: 'Hunters can use this link to join your campaign.',
    });
  };

  const handleLeaveCampaign = async (campaignId: string) => {
    if (confirm('Are you sure you want to leave this campaign?')) {
      await leaveCampaign.mutateAsync(campaignId);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-4xl font-bold mb-2 gradient-text-shadow">
              CAMPAIGNS
            </h1>
            <p className="text-muted-foreground font-heading">
              Create or join campaigns to play with others across the Shadow Monarch's domain
            </p>
          </div>
          <Button 
            onClick={() => setCreateDialogOpen(true)}
            className="gap-2 font-heading"
          >
            <Plus className="w-4 h-4" />
            New Campaign
          </Button>
        </div>

        {/* My Campaigns (Gate Master) */}
        <div className="mb-8">
          <h2 className="font-display text-2xl font-bold mb-4 gradient-text-gold flex items-center gap-2">
            <Crown className="w-5 h-5" />
            CAMPAIGNS I RUN
          </h2>
          {loadingMy ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : myCampaigns.length === 0 ? (
            <SystemWindow title="NO CAMPAIGNS" className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                You haven't created any campaigns yet. Create one to start playing with others.
              </p>
              <Button onClick={() => setCreateDialogOpen(true)}>
                Create Your First Campaign
              </Button>
            </SystemWindow>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myCampaigns.map((campaign) => (
                <SystemWindow key={campaign.id} title={campaign.name.toUpperCase()} className="hover:border-primary/50 transition-colors">
                  <p className="text-sm text-muted-foreground mb-4 min-h-[3rem]">
                    {campaign.description || 'No description provided.'}
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <span className="text-xs font-display text-muted-foreground">SHARE CODE</span>
                      <span className="font-mono font-bold text-lg text-primary">{campaign.share_code}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-2"
                        onClick={() => handleCopyShareLink(campaign.share_code)}
                      >
                        <Copy className="w-3 h-3" />
                        Copy Link
                      </Button>
                      <Link to={`/campaigns/${campaign.id}`} className="flex-1">
                        <Button variant="default" size="sm" className="w-full gap-2">
                          <ExternalLink className="w-3 h-3" />
                          Open
                        </Button>
                      </Link>
                    </div>
                  </div>
                </SystemWindow>
              ))}
            </div>
          )}
        </div>

        {/* Joined Campaigns (Hunter) */}
        <div>
          <h2 className="font-display text-2xl font-bold mb-4 gradient-text-system flex items-center gap-2">
            <Users className="w-5 h-5" />
            CAMPAIGNS I'M IN
          </h2>
          {loadingJoined ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : joinedCampaigns.length === 0 ? (
            <SystemWindow title="NO JOINED CAMPAIGNS" className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                You haven't joined any campaigns yet. Ask your Gate Master (System) for a share code or link.
              </p>
              <Link to="/campaigns/join">
                <Button>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Join Campaign
                </Button>
              </Link>
            </SystemWindow>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {joinedCampaigns.map((campaign) => (
                <SystemWindow key={campaign.id} title={campaign.name.toUpperCase()} className="hover:border-primary/50 transition-colors">
                  <p className="text-sm text-muted-foreground mb-4 min-h-[3rem]">
                    {campaign.description || 'No description provided.'}
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <span className="text-xs font-display text-muted-foreground">ROLE</span>
                      <span className="font-heading font-semibold text-accent">
                        {campaign.member_role === 'co-system' ? 'Co-System' : 'Hunter'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/campaigns/${campaign.id}`} className="flex-1">
                        <Button variant="default" size="sm" className="w-full gap-2">
                          <ExternalLink className="w-3 h-3" />
                          Open
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => handleLeaveCampaign(campaign.id)}
                      >
                        <LogOut className="w-3 h-3" />
                        Leave
                      </Button>
                    </div>
                  </div>
                </SystemWindow>
              ))}
            </div>
          )}
        </div>

        {/* Create Campaign Dialog */}
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
              <DialogDescription>
                Create a campaign and share the code with your Hunters. They can join from anywhere.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="campaign-name">Campaign Name</Label>
                <Input
                  id="campaign-name"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="The Shadow Monarch's Quest"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="campaign-description">Description (Optional)</Label>
                <Textarea
                  id="campaign-description"
                  value={campaignDescription}
                  onChange={(e) => setCampaignDescription(e.target.value)}
                  placeholder="A campaign set in the post-reset world..."
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateCampaign} disabled={createCampaign.isPending}>
                {createCampaign.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Campaign'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Campaigns;

