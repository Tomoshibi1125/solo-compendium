import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, UserPlus, ArrowLeft } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCampaignByShareCode, useJoinCampaign } from '@/hooks/useCampaigns';
import { useCharacters } from '@/hooks/useCharacters';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const CampaignJoin = () => {
  const { shareCode: urlShareCode } = useParams<{ shareCode: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [shareCode, setShareCode] = useState(urlShareCode?.toUpperCase() || '');
  const [selectedCharacter, setSelectedCharacter] = useState<string>('');

  const { data: campaign, isLoading: loadingCampaign, error: campaignError } = useCampaignByShareCode(shareCode);
  const { data: characters = [] } = useCharacters();
  const joinCampaign = useJoinCampaign();

  const handleJoin = async () => {
    if (!campaign) return;

    try {
      await joinCampaign.mutateAsync({
        campaignId: campaign.id,
        characterId: selectedCharacter || undefined,
      });
      navigate(`/campaigns/${campaign.id}`);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleShareCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (shareCode.length === 6) {
      // Trigger query by updating shareCode state
      setShareCode(shareCode.toUpperCase());
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Link to="/campaigns">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Campaigns
          </Button>
        </Link>

        <h1 className="font-display text-4xl font-bold mb-2 gradient-text-shadow">
          JOIN CAMPAIGN
        </h1>
        <p className="text-muted-foreground font-heading mb-8">
          Enter the share code provided by your Shadow Monarch (DM) to join their campaign
        </p>

        {/* Share Code Input */}
        {!campaign && (
          <SystemWindow title="ENTER SHARE CODE" className="mb-6">
            <form onSubmit={handleShareCodeSubmit} className="space-y-4">
              <div>
                <Label htmlFor="share-code">Share Code</Label>
                <Input
                  id="share-code"
                  value={shareCode}
                  onChange={(e) => setShareCode(e.target.value.toUpperCase().slice(0, 6))}
                  placeholder="ABC123"
                  className="mt-1 font-mono text-center text-2xl tracking-widest"
                  maxLength={6}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Enter the 6-character code your Shadow Monarch (DM) provided
                </p>
              </div>
              <Button type="submit" className="w-full" disabled={shareCode.length !== 6}>
                {loadingCampaign ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Looking up campaign...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Find Campaign
                  </>
                )}
              </Button>
            </form>
          </SystemWindow>
        )}

        {/* Campaign Found */}
        {campaign && (
          <SystemWindow title="CAMPAIGN FOUND" variant="quest" className="mb-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-heading text-xl font-semibold mb-2">{campaign.name}</h3>
                {campaign.description && (
                  <p className="text-sm text-muted-foreground">{campaign.description}</p>
                )}
              </div>
              <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                <span className="text-xs font-display text-muted-foreground">SHARE CODE</span>
                <span className="font-mono font-bold text-lg text-primary">{campaign.share_code}</span>
              </div>
            </div>
          </SystemWindow>
        )}

        {/* Character Selection */}
        {campaign && characters.length > 0 && (
          <SystemWindow title="SELECT HUNTER (OPTIONAL)" className="mb-6">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Optionally link one of your Hunters to this campaign. You can change this later.
              </p>
              <Select value={selectedCharacter} onValueChange={setSelectedCharacter}>
                <SelectTrigger>
                  <SelectValue placeholder="No Hunter linked" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No Hunter linked</SelectItem>
                  {characters.map((char) => (
                    <SelectItem key={char.id} value={char.id}>
                      {char.name} - Level {char.level} {char.job}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </SystemWindow>
        )}

        {/* Join Button */}
        {campaign && (
          <Button
            onClick={handleJoin}
            className="w-full"
            size="lg"
            disabled={joinCampaign.isPending}
          >
            {joinCampaign.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Joining...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Join Campaign
              </>
            )}
          </Button>
        )}

        {/* Error State */}
        {campaignError && (
          <SystemWindow title="ERROR" variant="alert" className="mt-6">
            <p className="text-destructive">
              Campaign not found. Please check the share code and try again.
            </p>
          </SystemWindow>
        )}
      </div>
    </Layout>
  );
};

export default CampaignJoin;

