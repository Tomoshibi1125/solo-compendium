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
  LogOut,
  Sparkles,
  Shield
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
            <h1 className="font-arise text-4xl font-bold mb-2 gradient-text-shadow tracking-wider">
              GUILD REGISTRY
            </h1>
            <p className="text-muted-foreground font-heading">
              Create or join guilds to hunt with others across the System's domain
            </p>
          </div>
          <Button 
            onClick={() => setCreateDialogOpen(true)}
            className="gap-2 font-heading bg-gradient-to-r from-arise to-shadow-purple hover:shadow-arise/30 hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            Create Guild
          </Button>
        </div>

        {/* My Campaigns (Gate Master) */}
        <div className="mb-8">
          <h2 className="font-arise text-2xl font-bold mb-4 gradient-text-gold flex items-center gap-2 tracking-wide">
            <Crown className="w-5 h-5 text-amber-400" />
            GUILDS I LEAD
          </h2>
          {loadingMy ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-amber-500/20 rounded-full" />
                <div className="absolute inset-0 w-12 h-12 border-4 border-t-amber-400 rounded-full animate-spin" />
              </div>
              <p className="text-muted-foreground font-heading animate-pulse">Loading guilds...</p>
            </div>
          ) : myCampaigns.length === 0 ? (
            <SystemWindow title="NO GUILDS FOUND" className="text-center py-8 border-amber-500/30">
              <Crown className="w-12 h-12 mx-auto text-amber-400/50 mb-4" />
              <p className="text-muted-foreground mb-4">
                You haven't established any guilds yet. Create one to unite Hunters under your banner.
              </p>
              <Button onClick={() => setCreateDialogOpen(true)} className="bg-gradient-to-r from-amber-500 to-amber-600 hover:shadow-amber-500/30 hover:shadow-lg">
                <Crown className="w-4 h-4 mr-2" />
                Establish Your Guild
              </Button>
            </SystemWindow>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myCampaigns.map((campaign) => (
                <div 
                  key={campaign.id} 
                  className="glass-card p-5 hover:border-amber-500/50 transition-all duration-300 border-l-4 border-l-amber-500/50 group relative overflow-hidden"
                >
                  {/* Background glow */}
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex items-start justify-between mb-3 relative">
                    <div className="flex items-center gap-2">
                      <Crown className="w-5 h-5 text-amber-400" />
                      <h3 className="font-arise text-lg font-semibold tracking-wide group-hover:text-amber-400 transition-colors">
                        {campaign.name.toUpperCase()}
                      </h3>
                    </div>
                    <span className="text-xs font-arise text-amber-400 bg-amber-500/10 px-2 py-1 rounded">
                      GUILD MASTER
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4 min-h-[3rem] relative">
                    {campaign.description || 'No description provided.'}
                  </p>
                  
                  <div className="space-y-3 relative">
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-500/10 to-transparent rounded-lg border border-amber-500/20">
                      <span className="text-xs font-arise text-muted-foreground tracking-wide">SHARE CODE</span>
                      <span className="font-mono font-bold text-xl text-amber-400 tracking-widest">{campaign.share_code}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-2 border-amber-500/30 hover:bg-amber-500/10 hover:border-amber-500/50"
                        onClick={() => handleCopyShareLink(campaign.share_code)}
                      >
                        <Copy className="w-3 h-3" />
                        Copy Link
                      </Button>
                      <Link to={`/campaigns/${campaign.id}`} className="flex-1">
                        <Button size="sm" className="w-full gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:shadow-amber-500/30 hover:shadow-lg">
                          <ExternalLink className="w-3 h-3" />
                          Open
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Joined Campaigns (Hunter) */}
        <div>
          <h2 className="font-arise text-2xl font-bold mb-4 gradient-text-system flex items-center gap-2 tracking-wide">
            <Users className="w-5 h-5 text-arise" />
            GUILDS I'VE JOINED
          </h2>
          {loadingJoined ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-arise/20 rounded-full" />
                <div className="absolute inset-0 w-12 h-12 border-4 border-t-arise rounded-full animate-spin" />
              </div>
              <p className="text-muted-foreground font-heading animate-pulse">Searching guilds...</p>
            </div>
          ) : joinedCampaigns.length === 0 ? (
            <SystemWindow title="NO JOINED GUILDS" className="text-center py-8">
              <Shield className="w-12 h-12 mx-auto text-arise/50 mb-4" />
              <p className="text-muted-foreground mb-4">
                You haven't joined any guilds yet. Ask your Guild Master for a share code or link.
              </p>
              <Link to="/campaigns/join">
                <Button className="bg-gradient-to-r from-arise to-shadow-purple">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Join Guild
                </Button>
              </Link>
            </SystemWindow>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {joinedCampaigns.map((campaign) => (
                <div 
                  key={campaign.id} 
                  className="glass-card p-5 hover:border-arise/50 transition-all duration-300 border-l-4 border-l-arise/50 group relative overflow-hidden"
                >
                  {/* Background glow */}
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-arise/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex items-start justify-between mb-3 relative">
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-arise" />
                      <h3 className="font-arise text-lg font-semibold tracking-wide group-hover:text-arise transition-colors">
                        {campaign.name.toUpperCase()}
                      </h3>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4 min-h-[3rem] relative">
                    {campaign.description || 'No description provided.'}
                  </p>
                  
                  <div className="space-y-3 relative">
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-arise/10 to-transparent rounded-lg border border-arise/20">
                      <span className="text-xs font-arise text-muted-foreground tracking-wide">YOUR ROLE</span>
                      <span className={cn(
                        "font-heading font-semibold px-2 py-1 rounded text-sm",
                        campaign.member_role === 'co-system' 
                          ? "text-amber-400 bg-amber-500/10" 
                          : "text-arise bg-arise/10"
                      )}>
                        {campaign.member_role === 'co-system' ? 'Co-System' : 'Hunter'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/campaigns/${campaign.id}`} className="flex-1">
                        <Button size="sm" className="w-full gap-2 bg-gradient-to-r from-arise to-shadow-purple">
                          <ExternalLink className="w-3 h-3" />
                          Open
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 border-destructive/30 hover:bg-destructive/10 hover:border-destructive/50 text-destructive"
                        onClick={() => handleLeaveCampaign(campaign.id)}
                      >
                        <LogOut className="w-3 h-3" />
                        Leave
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Campaign Dialog */}
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent className="border-arise/30 bg-background/95 backdrop-blur-xl">
            <DialogHeader>
              <DialogTitle className="font-arise text-xl flex items-center gap-2 tracking-wide">
                <Sparkles className="w-5 h-5 text-arise" />
                CREATE NEW GUILD
              </DialogTitle>
              <DialogDescription>
                Establish your guild and share the code with your Hunters. They can join from anywhere in the realm.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="campaign-name" className="font-heading">Guild Name</Label>
                <Input
                  id="campaign-name"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="The Shadow Legion"
                  className="mt-1 border-arise/30 focus:border-arise/50"
                />
              </div>
              <div>
                <Label htmlFor="campaign-description" className="font-heading">Description (Optional)</Label>
                <Textarea
                  id="campaign-description"
                  value={campaignDescription}
                  onChange={(e) => setCampaignDescription(e.target.value)}
                  placeholder="A guild dedicated to clearing the highest rank gates..."
                  className="mt-1 border-arise/30 focus:border-arise/50"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)} className="font-heading">
                Cancel
              </Button>
              <Button 
                onClick={handleCreateCampaign} 
                disabled={createCampaign.isPending}
                className="font-heading bg-gradient-to-r from-arise to-shadow-purple"
              >
                {createCampaign.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Crown className="w-4 h-4 mr-2" />
                    Establish Guild
                  </>
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
