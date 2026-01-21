import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, Users, Copy, Loader2, Crown, MessageSquare, FileText, Share2, Settings, Layers } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCampaign, useCampaignMembers, useHasDMAccess, useCampaignRole } from '@/hooks/useCampaigns';
import { RoleBadge } from '@/components/ui/RoleBadge';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { CampaignChat } from '@/components/campaign/CampaignChat';
import { CampaignNotes } from '@/components/campaign/CampaignNotes';
import { CampaignCharacters } from '@/components/campaign/CampaignCharacters';
import { CampaignSettings } from '@/components/campaign/CampaignSettings';
import { useAuth } from '@/lib/auth/authContext';
import { formatMonarchVernacular } from '@/lib/vernacular';

const CampaignDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview');
  const { user, loading } = useAuth();
  const guestEnabled = import.meta.env.VITE_GUEST_ENABLED !== 'false';
  const isE2E = import.meta.env.VITE_E2E === 'true';

  const { data: campaign, isLoading: loadingCampaign } = useCampaign(id || '');
  const { data: members = [], isLoading: loadingMembers } = useCampaignMembers(id || '');
  const { data: hasDMAccess = false, isLoading: loadingDMAccess } = useHasDMAccess(id || '');
  const { data: userRole, isLoading: loadingRole } = useCampaignRole(id || '');

  // Real-time updates for campaign members
  useEffect(() => {
    if (!id) return;
    if (!isSupabaseConfigured || isE2E || loading || (guestEnabled && !user)) return;

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
  }, [guestEnabled, id, isE2E, loading, queryClient, user]);  

  const handleCopyShareLink = () => {
    if (!campaign) return;
    const shareUrl = `${window.location.origin}/campaigns/join/${campaign.share_code}`;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: 'Share link copied!',
      description: 'Ascendants can use this link to join your campaign.',
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
              <RoleBadge role={userRole} />
            )}
          </div>
          {campaign.description && (
            <p className="text-muted-foreground font-heading">{campaign.description}</p>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className={hasDMAccess ? "grid w-full grid-cols-6" : "grid w-full grid-cols-5"}>
            <TabsTrigger value="overview" className="gap-2">
              <Users className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="vtt" className="gap-2">
              <Layers className="w-4 h-4" />
              VTT
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

          <TabsContent value="vtt">
            <SystemWindow title="VIRTUAL TABLETOP" variant="quest">
              <div className="space-y-6 text-center py-12">
                <Layers className="w-16 h-16 text-primary mx-auto mb-4 opacity-50" />
                <h2 className="font-arise text-2xl font-bold mb-4">Full-Featured VTT System</h2>
                <p className="text-muted-foreground font-heading max-w-2xl mx-auto mb-6">
                  Access the complete Virtual Tabletop system with maps, tokens, initiative tracking, 
                  dice rolling, chat, fog of war, and more. Everything you need for running sessions online.
                </p>
                <Link to={`/campaigns/${id}/vtt`}>
                  <Button className="btn-umbral" size="lg">
                    <Layers className="w-5 h-5 mr-2" />
                    Launch VTT
                  </Button>
                </Link>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-left max-w-3xl mx-auto">
                  <div className="p-4 rounded-lg border border-border bg-muted/30">
                    <h3 className="font-heading font-semibold mb-2">🎯 Token Management</h3>
                    <p className="text-xs text-muted-foreground">
                      Place character tokens, monsters, and NPCs. Drag, rotate, and manage HP directly on tokens.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border border-border bg-muted/30">
                    <h3 className="font-heading font-semibold mb-2">⚔️ Initiative Tracking</h3>
                    <p className="text-xs text-muted-foreground">
                      Track combat initiative with automatic sorting. Manage turn order and combat flow.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border border-border bg-muted/30">
                    <h3 className="font-heading font-semibold mb-2">🎲 Dice & Chat</h3>
                    <p className="text-xs text-muted-foreground">
                      Roll dice with full notation support. Chat with party members in real-time.
                    </p>
                  </div>
                </div>
              </div>
            </SystemWindow>
          </TabsContent>

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
                        <p className="text-xs text-muted-foreground mb-2">Share this link with Ascendants:</p>
                        <p className="text-sm font-mono bg-muted p-2 rounded break-all">
                          {window.location.origin}/campaigns/join/{campaign.share_code}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-sm text-muted-foreground font-heading mb-2">
                        Share code and invite links are only visible to the Protocol Warden (System).
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Ask your Protocol Warden (System) for the share code to invite others.
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
                      // Check if this member is the System (Protocol Warden)
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
                                {member.characters?.name || 'No Ascendant linked'}
                              </p>
                              {member.characters && (
                                <p className="text-xs text-muted-foreground">
                                  Level {member.characters.level} {formatMonarchVernacular(member.characters.job || 'Unknown')}
                                </p>
                              )}
                            </div>
                          </div>
                          <span className="text-xs font-display text-muted-foreground">
                            {isDM ? 'System' : member.role === 'co-system' ? 'Co-System' : 'Ascendant'}
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



