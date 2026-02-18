import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle, Coins, Swords, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useCampaignMembers } from '@/hooks/useCampaigns';

interface EncounterRewardsProps {
  campaignId: string;
  sessionId: string;
  onComplete?: () => void;
}

interface Combatant {
  id: string;
  name: string;
  member_id: string | null;
  xp_worth?: number;
  loot_worth?: number;
}

interface RewardDistribution {
  characterId: string;
  characterName: string;
  xp: number;
  loot: string[];
}

export const EncounterRewards = ({ campaignId, sessionId, onComplete }: EncounterRewardsProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [distributions, setDistributions] = useState<RewardDistribution[]>([]);
  const [totalXP, setTotalXP] = useState(0);
  const [totalLoot, setTotalLoot] = useState<string[]>([]);
  const [distributionMode, setDistributionMode] = useState<'equal' | 'custom'>('equal');

  const { data: campaignMembers } = useCampaignMembers(campaignId);
  const { data: combatants } = useQuery({
    queryKey: ['combatants', sessionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('campaign_combatants')
        .select('id, name, member_id, stats')
        .eq('session_id', sessionId);

      if (error) throw error;

      // Extract xp_worth and loot_worth from stats JSON
      return (data || []).map((combatant: any) => ({
        id: combatant.id,
        name: combatant.name,
        member_id: combatant.member_id,
        xp_worth: (combatant.stats as any)?.xp_worth,
        loot_worth: (combatant.stats as any)?.loot_worth,
      })) as Combatant[];
    },
    enabled: !!sessionId,
  });

  const playerCharacters = campaignMembers?.filter(member => member.characters).map(member => ({
    id: member.characters!.id,
    name: member.characters!.name,
    level: member.characters!.level,
  })) || [];

  useEffect(() => {
    if (combatants && playerCharacters.length > 0) {
      // Calculate total XP from defeated monsters
      const defeatedMonsters = combatants.filter(c => c.member_id === null);
      const xpTotal = defeatedMonsters.reduce((sum, monster) => sum + (monster.xp_worth || 0), 0);

      // Collect loot from monsters
      const lootItems = defeatedMonsters
        .map(monster => monster.loot_worth ? [monster.loot_worth.toString()] : [])
        .flat();

      setTotalXP(xpTotal);
      setTotalLoot(lootItems);

      // Initialize distributions
      const initialDistributions = playerCharacters.map(character => ({
        characterId: character.id,
        characterName: character.name,
        xp: distributionMode === 'equal' ? Math.floor(xpTotal / playerCharacters.length) : 0,
        loot: [],
      }));

      setDistributions(initialDistributions);
    }
  }, [combatants, playerCharacters, distributionMode]);

  const handleDistributeXP = () => {
    if (distributionMode === 'equal') {
      const xpPerPlayer = Math.floor(totalXP / playerCharacters.length);
      setDistributions(prev => prev.map(dist => ({ ...dist, xp: xpPerPlayer })));
    }
  };

  const handleCustomXPChange = (characterId: string, xp: number) => {
    setDistributions(prev => prev.map(dist =>
      dist.characterId === characterId ? { ...dist, xp } : dist
    ));
  };

  const handleLootAssignment = (characterId: string, lootItem: string, checked: boolean) => {
    setDistributions(prev => prev.map(dist => {
      if (dist.characterId === characterId) {
        const newLoot = checked
          ? [...dist.loot, lootItem]
          : dist.loot.filter(item => item !== lootItem);
        return { ...dist, loot: newLoot };
      }
      return dist;
    }));
  };

  const distributeRewards = useMutation({
    mutationFn: async () => {
      // Update character XP
      for (const dist of distributions) {
        if (dist.xp > 0) {
          // Get current XP
          const { data: character } = await supabase
            .from('characters')
            .select('experience')
            .eq('id', dist.characterId)
            .single();

          if (character) {
            const newXP = (character.experience || 0) + dist.xp;
            const { error } = await supabase
              .from('characters')
              .update({ experience: newXP })
              .eq('id', dist.characterId);
            if (error) throw error;
          }
        }

        // Add loot items
        for (const lootItem of dist.loot) {
          const { error } = await supabase
            .from('character_equipment')
            .insert({
              character_id: dist.characterId,
              name: lootItem,
              item_type: 'treasure',
              quantity: 1,
              is_equipped: false,
            });
          if (error) throw error;
        }
      }
    },
    onSuccess: () => {
      toast({
        title: 'Rewards Distributed',
        description: 'XP and loot have been awarded to the party.',
      });

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['characters'] });
      queryClient.invalidateQueries({ queryKey: ['campaign-session-logs', sessionId] });

      onComplete?.();
    },
    onError: (error) => {
      toast({
        title: 'Distribution Failed',
        description: 'Failed to distribute rewards. Please try again.',
        variant: 'destructive',
      });
      console.error('Reward distribution error:', error);
    },
  });

  const handleDistribute = () => {
    distributeRewards.mutate();
  };

  if (!combatants || playerCharacters.length === 0) {
    return null;
  }

  const totalDistributedXP = distributions.reduce((sum, dist) => sum + dist.xp, 0);

  return (
    <SystemWindow title="ENCOUNTER COMPLETE - DISTRIBUTE REWARDS" variant="arise">
      <div className="space-y-6">
        {/* Encounter Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <Swords className="w-8 h-8 mx-auto mb-2 text-red-400" />
            <div className="font-display text-2xl font-bold">{combatants.filter(c => c.member_id === null).length}</div>
            <div className="text-sm text-muted-foreground">Enemies Defeated</div>
          </div>
          <div className="text-center">
            <Coins className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
            <div className="font-display text-2xl font-bold">{totalXP}</div>
            <div className="text-sm text-muted-foreground">Total XP</div>
          </div>
          <div className="text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-blue-400" />
            <div className="font-display text-2xl font-bold">{playerCharacters.length}</div>
            <div className="text-sm text-muted-foreground">Party Members</div>
          </div>
        </div>

        {/* XP Distribution */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-semibold">XP Distribution</h3>
            <Select value={distributionMode} onValueChange={(value: 'equal' | 'custom') => setDistributionMode(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="equal">Equal Split</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {distributionMode === 'equal' && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {totalXP} XP ÷ {playerCharacters.length} members = {Math.floor(totalXP / playerCharacters.length)} XP each
              </span>
              <Button onClick={handleDistributeXP} variant="outline" size="sm">
                Apply Equal Distribution
              </Button>
            </div>
          )}

          <div className="grid gap-3">
            {distributions.map((dist) => (
              <div key={dist.characterId} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                <div className="flex-1">
                  <span className="font-heading font-medium">{dist.characterName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor={`xp-${dist.characterId}`} className="text-sm">XP:</Label>
                  <Input
                    id={`xp-${dist.characterId}`}
                    type="number"
                    value={dist.xp}
                    onChange={(e) => handleCustomXPChange(dist.characterId, parseInt(e.target.value) || 0)}
                    className="w-20 h-8 text-center"
                    disabled={distributionMode === 'equal'}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="text-sm text-muted-foreground text-right">
            Total Distributed: {totalDistributedXP} / {totalXP} XP
          </div>
        </div>

        {/* Loot Distribution */}
        {totalLoot.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-heading font-semibold">Loot Distribution</h3>
            <div className="grid gap-3">
              {totalLoot.map((lootItem, index) => (
                <div key={`${lootItem}-${index}`} className="p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Coins className="w-4 h-4 text-yellow-400" />
                    <span className="font-heading font-medium">{lootItem}</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {distributions.map((dist) => (
                      <div key={dist.characterId} className="flex items-center gap-2">
                        <Checkbox
                          id={`loot-${index}-${dist.characterId}`}
                          checked={dist.loot.includes(lootItem)}
                          onCheckedChange={(checked) =>
                            handleLootAssignment(dist.characterId, lootItem, checked as boolean)
                          }
                        />
                        <Label
                          htmlFor={`loot-${index}-${dist.characterId}`}
                          className="text-xs cursor-pointer"
                        >
                          {dist.characterName}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Distribute Button */}
        <div className="flex justify-end pt-4 border-t border-border">
          <Button
            onClick={handleDistribute}
            disabled={distributeRewards.isPending}
            className="gap-2"
          >
            {distributeRewards.isPending ? (
              <>
                <CheckCircle className="w-4 h-4 animate-spin" />
                Distributing...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Distribute Rewards
              </>
            )}
          </Button>
        </div>
      </div>
    </SystemWindow>
  );
};
