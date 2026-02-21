import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sword, 
  Shield, 
  Heart, 
  Zap, 
  Users, 
  Map, 
  Eye, 
  EyeOff,
  Maximize2,
  Minimize2,
  Settings,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCharacter } from '@/hooks/useCharacters';
import { useCampaignByCharacterId } from '@/hooks/useCampaigns';
import { useRealtimeCollaboration } from '@/hooks/useRealtimeCollaboration';
import { calculateCharacterStats, formatModifier } from '@/lib/characterCalculations';
import { getAbilityModifier } from '@/types/system-rules';
import { rollDiceString, formatRollResult } from '@/lib/diceRoller';
import { useToast } from '@/hooks/use-toast';

interface CharacterSheetVTTIntegrationProps {
  characterId: string;
  className?: string;
}

export const CharacterSheetVTTIntegration: React.FC<CharacterSheetVTTIntegrationProps> = ({
  characterId,
  className
}) => {
  const { data: character } = useCharacter(characterId);
  const { data: campaign } = useCampaignByCharacterId(characterId);
  const { broadcastDiceRoll, isConnected } = useRealtimeCollaboration(campaign?.id || '');
  const { toast } = useToast();
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('stats');
  const [showVTTDialog, setShowVTTDialog] = useState(false);

  const stats = React.useMemo(() => {
    if (!character) return null;
    return calculateCharacterStats({
      level: character.level,
      abilities: character.abilities,
      savingThrowProficiencies: character.saving_throw_proficiencies || [],
      skillProficiencies: character.skill_proficiencies || [],
      skillExpertise: character.skill_expertise || [],
      armorClass: character.armor_class,
      speed: character.speed,
    });
  }, [character]);

  const rollAndRecord = (options: {
    title: string;
    formula: string;
    rollType: string;
    context: string;
    modifier?: number;
  }) => {
    if (!character) return;
    try {
      const roll = rollDiceString(options.formula);
      const scope = campaign?.id && isConnected ? 'campaign' : 'local';
      const message = `${options.title}: ${formatRollResult(roll)}${scope === 'campaign' ? ' (shared)' : ''}`;
      
      toast({
        title: 'Dice Roll',
        description: message,
      });

      // Broadcast to campaign if connected
      if (scope === 'campaign') {
        broadcastDiceRoll(options.formula, roll.result, {
          characterName: character.name,
          rollType: options.rollType,
          context: options.context,
          rolls: roll.rolls,
        });
      }
    } catch {
      toast({
        title: 'Roll failed',
        description: 'Could not execute roll.',
        variant: 'destructive',
      });
    }
  };

  const handleQuickRoll = (type: 'attack' | 'damage' | 'skill' | 'save') => {
    if (!character || !stats) return;
    
    switch (type) {
      case 'attack':
        rollAndRecord({
          title: 'Attack Roll',
          formula: '1d20',
          rollType: 'attack',
          context: 'Attack',
          modifier: stats.proficiencyBonus,
        });
        break;
      case 'damage':
        rollAndRecord({
          title: 'Damage Roll',
          formula: '1d8',
          rollType: 'damage',
          context: 'Damage',
        });
        break;
      case 'skill':
        // Roll best skill ( Athletics)
        const athleticsMod = getAbilityModifier(character.abilities.STR) + 
          (character.skill_proficiencies?.includes('Athletics') ? stats.proficiencyBonus : 0);
        rollAndRecord({
          title: 'Athletics Check',
          formula: `1d20${athleticsMod >= 0 ? '+' : ''}${athleticsMod}`,
          rollType: 'skill',
          context: 'Athletics',
          modifier: athleticsMod,
        });
        break;
      case 'save':
        // Roll best save (usually STR or DEX)
        const strSave = getAbilityModifier(character.abilities.STR) + 
          (character.saving_throw_proficiencies?.includes('STR') ? stats.proficiencyBonus : 0);
        rollAndRecord({
          title: 'STR Save',
          formula: `1d20${strSave >= 0 ? '+' : ''}${strSave}`,
          rollType: 'save',
          context: 'STR Save',
          modifier: strSave,
        });
        break;
    }
  };

  if (!character || !stats) {
    return (
      <div className={cn("p-4 text-center text-muted-foreground", className)}>
        Character data not available
      </div>
    );
  }

  return (
    <div className={cn("character-sheet-vtt-integration", className)}>
      {/* Compact Header */}
      <div className="flex items-center justify-between p-3 bg-card border border-border rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <Users className="w-4 h-4 text-primary" />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-sm truncate">{character.name}</div>
            <div className="text-xs text-muted-foreground">Level {character.level}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {campaign && (
            <Badge variant={isConnected ? 'default' : 'secondary'} className="text-xs">
              {isConnected ? 'LIVE' : 'OFFLINE'}
            </Badge>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="min-h-[36px] px-2"
          >
            {isExpanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowVTTDialog(true)}
            className="min-h-[36px] px-2"
          >
            <Map className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Expanded Stats */}
      {isExpanded && (
        <div className="mt-2 p-3 bg-card border border-border rounded-lg space-y-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-muted rounded-lg">
              <TabsTrigger value="stats" className="text-xs py-1.5">Stats</TabsTrigger>
              <TabsTrigger value="actions" className="text-xs py-1.5">Actions</TabsTrigger>
              <TabsTrigger value="vtt" className="text-xs py-1.5">VTT</TabsTrigger>
            </TabsList>

            <TabsContent value="stats" className="mt-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center p-2 bg-muted/30 rounded">
                  <div className="text-xs text-muted-foreground mb-1">HP</div>
                  <div className="font-bold text-lg">{character.hp_current}/{character.hp_max}</div>
                </div>
                <div className="text-center p-2 bg-muted/30 rounded">
                  <div className="text-xs text-muted-foreground mb-1">AC</div>
                  <div className="font-bold text-lg">{stats.armorClass}</div>
                </div>
                <div className="text-center p-2 bg-muted/30 rounded">
                  <div className="text-xs text-muted-foreground mb-1">Init</div>
                  <div className="font-bold text-lg">{formatModifier(stats.initiative)}</div>
                </div>
                <div className="text-center p-2 bg-muted/30 rounded">
                  <div className="text-xs text-muted-foreground mb-1">Speed</div>
                  <div className="font-bold text-lg">{stats.speed} ft</div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="actions" className="mt-2">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickRoll('attack')}
                  className="min-h-[36px]"
                >
                  <Sword className="w-3 h-3 mr-1" />
                  Attack
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickRoll('damage')}
                  className="min-h-[36px]"
                >
                  <Zap className="w-3 h-3 mr-1" />
                  Damage
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickRoll('skill')}
                  className="min-h-[36px]"
                >
                  <Users className="w-3 h-3 mr-1" />
                  Skill
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickRoll('save')}
                  className="min-h-[36px]"
                >
                  <Shield className="w-3 h-3 mr-1" />
                  Save
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="vtt" className="mt-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                  <span className="text-sm font-medium">VTT Status</span>
                  <Badge variant={campaign ? 'default' : 'secondary'} className="text-xs">
                    {campaign ? 'In Campaign' : 'No Campaign'}
                  </Badge>
                </div>
                {campaign && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowVTTDialog(true)}
                    className="w-full min-h-[36px]"
                  >
                    <Map className="w-3 h-3 mr-2" />
                    Open VTT Interface
                  </Button>
                )}
                <div className="text-xs text-muted-foreground text-center">
                  {isConnected ? 'Connected to campaign VTT' : 'Connect to campaign for VTT features'}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* VTT Dialog */}
      <Dialog open={showVTTDialog} onOpenChange={setShowVTTDialog}>
        <DialogContent className="max-w-4xl w-[calc(100%-2rem)] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>VTT Integration</DialogTitle>
            <DialogDescription>
              Connect your character to the virtual tabletop for enhanced gameplay experience.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Character Status */}
            <div className="p-4 bg-muted/30 rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Character Status
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">HP</div>
                  <div className="font-bold">{character.hp_current}/{character.hp_max}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">AC</div>
                  <div className="font-bold">{stats.armorClass}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Init</div>
                  <div className="font-bold">{formatModifier(stats.initiative)}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Speed</div>
                  <div className="font-bold">{stats.speed} ft</div>
                </div>
              </div>
            </div>

            {/* Campaign Status */}
            <div className="p-4 bg-muted/30 rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Map className="w-4 h-4" />
                Campaign Status
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Campaign:</span>
                  <Badge variant={campaign ? 'default' : 'secondary'}>
                    {campaign ? campaign.name : 'None'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>VTT Status:</span>
                  <Badge variant={isConnected ? 'default' : 'secondary'}>
                    {isConnected ? 'Connected' : 'Offline'}
                  </Badge>
                </div>
                {campaign && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      window.location.href = `/dm-tools/vtt-enhanced?campaignId=${campaign.id}`;
                    }}
                    className="w-full min-h-[36px]"
                  >
                    Open VTT Interface
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-4 bg-muted/30 rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickRoll('attack')}
                  className="min-h-[36px]"
                >
                  <Sword className="w-3 h-3 mr-1" />
                  Attack
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickRoll('damage')}
                  className="min-h-[36px]"
                >
                  <Zap className="w-3 h-3 mr-1" />
                  Damage
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickRoll('skill')}
                  className="min-h-[36px]"
                >
                  <Users className="w-3 h-3 mr-1" />
                  Skill
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickRoll('save')}
                  className="min-h-[36px]"
                >
                  <Shield className="w-3 h-3 mr-1" />
                  Save
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVTTDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
