import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, Users, Copy, Loader2, Crown, MessageSquare, FileText, Share2, Settings, Shield } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCampaign, useCampaignMembers, useHasDMAccess, useCampaignRole } from '@/hooks/useCampaigns';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { CampaignChat } from '@/components/campaign/CampaignChat';
import { CampaignNotes } from '@/components/campaign/CampaignNotes';
import { CampaignCharacters } from '@/components/campaign/CampaignCharacters';
import { CampaignSettings } from '@/components/campaign/CampaignSettings';

const CampaignDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview');

  const { data: campaign, isLoading: loadingCampaign } = useCampaign(id || '');
  const { data: members = [], isLoading: loadingMembers } = useCampaignMembers(id || '');
  const { data: hasDMAccess = false, isLoading: loadingDMAccess } = useHasDMAccess(id || '');
  const { data: userRole, isLoading: loadingRole } = useCampaignRole(id || '');

  // Real-time updates for campaign members
  useEffect(() => {
    if (!id) return;

    const channel = supabase
      .channel(`campaign:${id}:members`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'campaign_members',
          filter: `campaign_id=eq.${id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['campaigns', id, 'members'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, queryClient]);  

  const handleCopyShareLink = () => {
    if (!campaign) return;
    const shareUrl = `${window.location.origin}/campaigns/join/${campaign.share_code}`;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: 'Share link copied!',
      description: 'Hunters can use this link to join your campaign.',
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
          <div className="flex items-center gap-4 mb-2">
            <h1 className="font-display text-4xl font-bold gradient-text-shadow">
              {campaign.name.toUpperCase()}
            </h1>
            {!loadingRole && userRole && (
              <div className="flex items-center gap-2">
                {userRole === 'system' && (
                  <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-primary/10 border border-primary/30">
                    <Crown className="w-4 h-4 text-primary" />
                    <span className="text-xs font-display text-primary font-semibold">GATE MASTER (SYSTEM)</span>
                  </div>
                )}
                {userRole === 'co-system' && (
                  <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-accent/10 border border-accent/30">
                    <Crown className="w-4 h-4 text-accent" />
                    <span className="text-xs font-display text-accent font-semibold">CO-SYSTEM</span>
                  </div>
                )}
                {userRole === 'hunter' && (
                  <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-muted border border-border">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs font-display text-muted-foreground font-semibold">HUNTER</span>
                  </div>
                )}
              </div>
            )}
          </div>
          {campaign.description && (
            <p className="text-muted-foreground font-heading">{campaign.description}</p>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className={hasDMAccess ? "grid w-full grid-cols-5" : "grid w-full grid-cols-4"}>
            <TabsTrigger value="overview" className="gap-2">
              <Users className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="chat" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="notes" className="gap-2">
              <FileText className="w-4 h-4" />
              Notes
            </TabsTrigger>
            <TabsTrigger value="characters" className="gap-2">
              <Share2 className="w-4 h-4" />
              Characters
            </TabsTrigger>
            {hasDMAccess && (
              <TabsTrigger value="settings" className="gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Campaign Info */}
              <SystemWindow title="CAMPAIGN INFO">
                <div className="space-y-4">
                  {hasDMAccess ? (
                    <>
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
                        <p className="text-xs text-muted-foreground mb-2">Share this link with Hunters:</p>
                        <p className="text-sm font-mono bg-muted p-2 rounded break-all">
                          {window.location.origin}/campaigns/join/{campaign.share_code}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-sm text-muted-foreground font-heading mb-2">
                        Share code and invite links are only visible to the Gate Master (System).
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Ask your Gate Master (System) for the share code to invite others.
                      </p>
                    </div>
                  )}
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
                    {members.map((member) => {
                      // Check if this member is the System (Gate Master)
                      const isDM = campaign.dm_id === member.user_id;
                      return (
                        <div
                          key={member.id}
                          className="flex items-center justify-between p-3 bg-muted/50 rounded"
                        >
                          <div className="flex items-center gap-3">
                            {isDM && (
                              <Crown className="w-4 h-4 text-primary" />
                            )}
                            {member.role === 'co-system' && !isDM && (
                              <Crown className="w-4 h-4 text-accent" />
                            )}
                            <div>
                              <p className="font-heading font-semibold">
                                {member.characters?.name || 'No Hunter linked'}
                              </p>
                              {member.characters && (
                                <p className="text-xs text-muted-foreground">
                                  Level {member.characters.level} {member.characters.job}
                                </p>
                              )}
                            </div>
                          </div>
                          <span className="text-xs font-display text-muted-foreground">
                            {isDM ? 'System' : member.role === 'co-system' ? 'Co-System' : 'Hunter'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </SystemWindow>
            </div>
          </TabsContent>

          <TabsContent value="chat">
            <CampaignChat campaignId={id || ''} />
          </TabsContent>

          <TabsContent value="notes">
            <CampaignNotes campaignId={id || ''} />
          </TabsContent>

          <TabsContent value="characters">
            <CampaignCharacters campaignId={id || ''} />
          </TabsContent>

          {hasDMAccess && (
            <TabsContent value="settings">
              <CampaignSettings campaignId={id || ''} />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </Layout>
  );
};

export default CampaignDetail;

