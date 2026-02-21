import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEncounterRewards } from '@/hooks/useEncounterRewards';
import { useCombatSessionManager } from '@/hooks/useCombatSessionManager';
import { useCampaignAnalytics } from '@/hooks/useCampaignAnalytics';
import { useToast } from '@/hooks/use-toast';
import { Calculator, Coins, Trophy, Users, Star, Target, Sparkles } from 'lucide-react';

interface EncounterRewardsPanelProps {
  campaignId: string;
  sessionId: string;
  className?: string;
}

interface RewardDistribution {
  characterId: string;
  characterName: string;
  xpAwarded: number;
  lootAwarded: string[];
  splitEvenly: boolean;
}

export function EncounterRewardsPanel({
  campaignId,
  sessionId,
  className
}: EncounterRewardsPanelProps) {
  const { toast } = useToast();
  const { calculateEncounterRewards, distributeRewards } = useEncounterRewards();
  const { generateSessionSummary } = useCombatSessionManager();
  const { getCampaignAnalytics } = useCampaignAnalytics();

  const [isCalculating, setIsCalculating] = useState(false);
  const [isDistributing, setIsDistributing] = useState(false);
  const [calculatedRewards, setCalculatedRewards] = useState<any>(null);
  const [distributionMethod, setDistributionMethod] = useState<'even' | 'custom'>('even');
  const [customXP, setCustomXP] = useState<Record<string, number>>({});
  const [sessionNotes, setSessionNotes] = useState('');
  const [includeInLog, setIncludeInLog] = useState(true);
  const [rewardDistribution, setRewardDistribution] = useState<RewardDistribution[]>([]);

  const handleCalculateRewards = async () => {
    setIsCalculating(true);
    try {
      const rewards = await calculateEncounterRewards(sessionId);
      setCalculatedRewards(rewards);
      
      // Initialize distribution with calculated values
      if (rewards && rewards.combatants) {
        const xpPerCharacter = Math.floor(rewards.xpTotal / rewards.combatants.length);
        const distribution = rewards.combatants.map((combatant) => ({
          characterId: combatant.id,
          characterName: combatant.name,
          xpAwarded: combatant.xp || xpPerCharacter,
          lootAwarded: [],
          splitEvenly: true
        }));
        setRewardDistribution(distribution);
      }

      toast({
        title: 'Rewards Calculated',
        description: `Total XP: ${rewards?.xpTotal || 0}, Combatants: ${rewards?.combatants?.length || 0}`,
      });
    } catch (error) {
      toast({
        title: 'Calculation Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const handleDistributeRewards = async () => {
    setIsDistributing(true);
    try {
      const selectedCharacters = rewardDistribution.map(dist => dist.characterId);
      const success = await distributeRewards(campaignId, calculatedRewards, selectedCharacters);

      if (success) {
        toast({
          title: 'Rewards Distributed',
          description: 'XP and loot have been awarded to party members',
        });

        // Generate session summary
        const summary = await generateSessionSummary(sessionId);

        if (summary) {
          toast({
            title: 'Session Summary Generated',
            description: 'Combat session has been logged and summarized',
          });
        }
      }
    } catch (error) {
      toast({
        title: 'Distribution Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
    } finally {
      setIsDistributing(false);
    }
  };

  const updateCharacterXP = (characterId: string, xp: number) => {
    setCustomXP(prev => ({ ...prev, [characterId]: xp }));
    setRewardDistribution(prev => 
      prev.map(dist => 
        dist.characterId === characterId 
          ? { ...dist, xpAwarded: xp, splitEvenly: false }
          : dist
      )
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'trivial': return 'bg-green-100 text-green-800';
      case 'easy': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-orange-100 text-orange-800';
      case 'deadly': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Encounter Rewards
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Calculate and distribute XP and loot after combat
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Calculation Section */}
        <div>
          <Button 
            onClick={handleCalculateRewards} 
            disabled={isCalculating}
            className="w-full"
          >
            <Calculator className="h-4 w-4 mr-2" />
            {isCalculating ? 'Calculating...' : 'Calculate Rewards'}
          </Button>
        </div>

        {calculatedRewards && (
          <>
            <Separator />

            {/* Rewards Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">Total XP</span>
                </div>
                <div className="text-2xl font-bold">{calculatedRewards.xpTotal || 0}</div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-red-500" />
                  <span className="font-medium">Combatants</span>
                </div>
                <div className="text-2xl font-bold">{calculatedRewards.combatants?.length || 0}</div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-500" />
                  <span className="font-medium">Loot Items</span>
                </div>
                <div className="text-2xl font-bold">{calculatedRewards.loot?.length || 0}</div>
              </Card>
            </div>

            <Separator />

            {/* Distribution Settings */}
            <div>
              <Label className="text-base font-medium">Distribution Method</Label>
              <Select value={distributionMethod} onValueChange={(value: 'even' | 'custom') => setDistributionMethod(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="even">Split Evenly</SelectItem>
                  <SelectItem value="custom">Custom Distribution</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Character Distribution */}
            <div>
              <Label className="text-base font-medium">Character Distribution</Label>
              <div className="space-y-3">
                {rewardDistribution.map((distribution) => (
                  <Card key={distribution.characterId} className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{distribution.characterName}</span>
                        {distributionMethod === 'even' && (
                          <Badge variant="outline">Even Split</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="text-sm">XP:</Label>
                        {distributionMethod === 'custom' ? (
                          <Input
                            type="number"
                            value={customXP[distribution.characterId] || distribution.xpAwarded}
                            onChange={(e) => updateCharacterXP(distribution.characterId, parseInt(e.target.value) || 0)}
                            className="w-20"
                          />
                        ) : (
                          <span className="font-bold">{distribution.xpAwarded}</span>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <Separator />

            {/* Session Options */}
            <div>
              <Label className="text-base font-medium">Session Options</Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="include-log" 
                    checked={includeInLog}
                    onCheckedChange={(checked) => setIncludeInLog(checked as boolean)}
                  />
                  <Label htmlFor="include-log">Include in campaign log</Label>
                </div>
                <div>
                  <Label htmlFor="session-notes">Session Notes</Label>
                  <Textarea
                    id="session-notes"
                    placeholder="Add notes about this encounter..."
                    value={sessionNotes}
                    onChange={(e) => setSessionNotes(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Distribution Action */}
            <Button 
              onClick={handleDistributeRewards} 
              disabled={isDistributing}
              className="w-full"
              size="lg"
            >
              <Coins className="h-4 w-4 mr-2" />
              {isDistributing ? 'Distributing...' : 'Distribute Rewards'}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
