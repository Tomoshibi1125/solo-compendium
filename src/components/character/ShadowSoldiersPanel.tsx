import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  useCharacterShadowSoldiers, 
  useCompendiumShadowSoldiers, 
  useExtractShadowSoldier, 
  useToggleSummon,
  useUpdateSoldierHP,
  type ShadowSoldier 
} from '@/hooks/useShadowSoldiers';
import { useCharacterMonarchUnlocks } from '@/hooks/useMonarchUnlocks';
import { Ghost, Sword, Shield, Heart, Zap, Plus, Minus, Crown } from 'lucide-react';

interface ShadowSoldiersPanelProps {
  characterId: string;
  characterLevel: number;
}

const rankColors: Record<string, string> = {
  'Marshal Grade': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'Elite Knight Grade': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Knight Grade': 'bg-green-500/20 text-green-400 border-green-500/30',
  'Soldier Grade': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

const typeIcons: Record<string, React.ReactNode> = {
  knight: <Sword className="h-4 w-4" />,
  insect: <Zap className="h-4 w-4" />,
  tank: <Shield className="h-4 w-4" />,
  berserker: <Sword className="h-4 w-4" />,
  beast: <Ghost className="h-4 w-4" />,
};

export function ShadowSoldiersPanel({ characterId, characterLevel }: ShadowSoldiersPanelProps) {
  const [selectedSoldier, setSelectedSoldier] = useState<ShadowSoldier | null>(null);
  const { data: mySoldiers = [] } = useCharacterShadowSoldiers(characterId);
  const { data: allSoldiers = [] } = useCompendiumShadowSoldiers();
  const { data: monarchUnlocks = [] } = useCharacterMonarchUnlocks(characterId);
  const extractSoldier = useExtractShadowSoldier();
  const toggleSummon = useToggleSummon();
  const updateHP = useUpdateSoldierHP();

  // Check if character has Shadow Monarch unlock
  const hasShadowMonarch = monarchUnlocks.some(u => u.monarch?.theme === 'Shadow');
  
  // Get soldiers this character can extract
  const extractedIds = new Set(mySoldiers.map(s => s.soldier_id));
  const availableSoldiers = allSoldiers.filter(s => {
    if (extractedIds.has(s.id)) return false;
    
    // Parse requirements
    const req = s.summon_requirements || '';
    const levelMatch = req.match(/Level (\d+)\+/);
    const requiredLevel = levelMatch ? parseInt(levelMatch[1]) : 0;
    
    return characterLevel >= requiredLevel && hasShadowMonarch;
  });

  const summonedCount = mySoldiers.filter(s => s.is_summoned).length;

  const handleHPChange = (soldierId: string, currentHp: number, maxHp: number, delta: number) => {
    const newHp = Math.max(0, Math.min(maxHp, currentHp + delta));
    updateHP.mutate({ characterId, shadowSoldierId: soldierId, currentHp: newHp });
  };

  if (!hasShadowMonarch) {
    return (
      <Card className="border-muted">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-muted-foreground">
            <Ghost className="h-5 w-5" />
            Shadow Army
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            Unlock the Shadow Monarch through a quest to command Shadow Soldiers.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/30">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Ghost className="h-5 w-5 text-primary" />
            Shadow Army
          </span>
          <Badge variant="outline">{summonedCount} Summoned</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summoned Soldiers */}
        {mySoldiers.length > 0 ? (
          <div className="space-y-3">
            {mySoldiers.map((css) => {
              const soldier = css.soldier;
              if (!soldier) return null;
              
              const hpPercent = (css.current_hp / soldier.hit_points) * 100;
              
              return (
                <div
                  key={css.id}
                  className={`p-3 rounded-lg border ${
                    css.is_summoned ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {typeIcons[soldier.shadow_type] || <Ghost className="h-4 w-4" />}
                      <span className="font-medium">
                        {css.nickname || soldier.name}
                      </span>
                      <Badge variant="outline" className={rankColors[soldier.rank] || ''}>
                        {soldier.rank}
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      variant={css.is_summoned ? 'default' : 'outline'}
                      onClick={() => toggleSummon.mutate({
                        characterId,
                        shadowSoldierId: css.id,
                        summon: !css.is_summoned,
                      })}
                    >
                      {css.is_summoned ? 'Dismiss' : 'Arise!'}
                    </Button>
                  </div>
                  
                  {css.is_summoned && (
                    <>
                      <div className="flex items-center gap-2 mb-2">
                        <Heart className="h-4 w-4 text-red-500" />
                        <Progress value={hpPercent} className="flex-1" />
                        <div className="flex items-center gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                            onClick={() => handleHPChange(css.id, css.current_hp, soldier.hit_points, -10)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm w-16 text-center">
                            {css.current_hp}/{soldier.hit_points}
                          </span>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                            onClick={() => handleHPChange(css.id, css.current_hp, soldier.hit_points, 10)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>AC {soldier.armor_class}</span>
                        <span>Speed {soldier.speed} ft</span>
                        <span>Bond Lv.{css.bond_level}</span>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-2">
            No shadow soldiers extracted yet.
          </p>
        )}

        {/* Extract New Soldier */}
        {availableSoldiers.length > 0 && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <Crown className="h-4 w-4 mr-2" />
                Extract Shadow Soldier
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Available Shadow Soldiers</DialogTitle>
              </DialogHeader>
              <ScrollArea className="max-h-[60vh]">
                <div className="space-y-4 p-1">
                  {availableSoldiers.map((soldier) => (
                    <Card
                      key={soldier.id}
                      className={`cursor-pointer transition-colors hover:border-primary ${
                        selectedSoldier?.id === soldier.id ? 'border-primary' : ''
                      }`}
                      onClick={() => setSelectedSoldier(soldier)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {typeIcons[soldier.shadow_type] || <Ghost className="h-5 w-5" />}
                            <CardTitle className="text-lg">{soldier.name}</CardTitle>
                          </div>
                          <Badge className={rankColors[soldier.rank] || ''}>
                            {soldier.rank}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground italic">{soldier.title}</p>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-3">{soldier.description}</p>
                        
                        <div className="flex gap-4 text-xs text-muted-foreground mb-3">
                          <span>HP {soldier.hit_points}</span>
                          <span>AC {soldier.armor_class}</span>
                          <span>Speed {soldier.speed} ft</span>
                        </div>
                        
                        <Separator className="my-2" />
                        
                        <div className="space-y-2">
                          <p className="text-xs font-medium">Abilities:</p>
                          {soldier.abilities.map((ability, i) => (
                            <div key={i} className="text-xs">
                              <span className="font-medium">{ability.name}</span>
                              <span className="text-muted-foreground ml-1">
                                ({ability.action_type})
                              </span>
                            </div>
                          ))}
                        </div>
                        
                        {selectedSoldier?.id === soldier.id && (
                          <Button
                            className="w-full mt-4"
                            onClick={(e) => {
                              e.stopPropagation();
                              extractSoldier.mutate({
                                characterId,
                                soldierId: soldier.id,
                              });
                              setSelectedSoldier(null);
                            }}
                            disabled={extractSoldier.isPending}
                          >
                            <Ghost className="h-4 w-4 mr-2" />
                            Extract {soldier.name}
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
}
