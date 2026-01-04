import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Copy, Loader2, Crown } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { useCampaign, useCampaignMembers } from '@/hooks/useCampaigns';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const CampaignDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: campaign, isLoading: loadingCampaign } = useCampaign(id || '');
  const { data: members = [], isLoading: loadingMembers } = useCampaignMembers(id || '');

  const handleCopyShareLink = () => {
    if (!campaign) return;
    const shareUrl = `${window.location.origin}/campaigns/join/${campaign.share_code}`;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: 'Share link copied!',
      description: 'Players can use this link to join your campaign.',
    });
  };

  if (loadingCampaign) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!campaign) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <SystemWindow title="CAMPAIGN NOT FOUND" variant="alert">
            <p className="text-destructive mb-4">This campaign does not exist or you don't have access to it.</p>
            <Link to="/campaigns">
              <Button>Back to Campaigns</Button>
            </Link>
          </SystemWindow>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Link to="/campaigns">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Campaigns
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold mb-2 gradient-text-shadow">
            {campaign.name.toUpperCase()}
          </h1>
          {campaign.description && (
            <p className="text-muted-foreground font-heading">{campaign.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Campaign Info */}
          <SystemWindow title="CAMPAIGN INFO">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                <span className="text-xs font-display text-muted-foreground">SHARE CODE</span>
                <span className="font-mono font-bold text-lg text-primary">{campaign.share_code}</span>
              </div>
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={handleCopyShareLink}
              >
                <Copy className="w-4 h-4" />
                Copy Share Link
              </Button>
              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2">Share this link with players:</p>
                <p className="text-sm font-mono bg-muted p-2 rounded break-all">
                  {window.location.origin}/campaigns/join/{campaign.share_code}
                </p>
              </div>
            </div>
          </SystemWindow>

          {/* Campaign Members */}
          <SystemWindow title="MEMBERS">
            {loadingMembers ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : members.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No members yet</p>
            ) : (
              <div className="space-y-2">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded"
                  >
                    <div className="flex items-center gap-3">
                      {member.role === 'co-dm' && (
                        <Crown className="w-4 h-4 text-accent" />
                      )}
                      <div>
                        <p className="font-heading font-semibold">
                          {member.characters?.name || 'No character linked'}
                        </p>
                        {member.characters && (
                          <p className="text-xs text-muted-foreground">
                            Level {member.characters.level} {member.characters.job}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="text-xs font-display text-muted-foreground">
                      {member.role === 'co-dm' ? 'Co-DM' : 'Player'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </SystemWindow>
        </div>
      </div>
    </Layout>
  );
};

export default CampaignDetail;

