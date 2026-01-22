import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { 
  useCharacterShadowSoldiers, 
  useCompendiumShadowSoldiers, 
  useExtractShadowSoldier, 
  useToggleSummon,
  useUpdateSoldierHP,
  type ShadowSoldier 
} from '@/hooks/useShadowSoldiers';
import { useCharacterMonarchUnlocks } from '@/hooks/useMonarchUnlocks';
import { Ghost, Sword, Shield, Heart, Zap, Plus, Minus, Crown, Skull, Flame, Bird, Dog, Mountain, Crosshair } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatMonarchVernacular, MONARCH_LABEL, normalizeMonarchSearch } from '@/lib/vernacular';

interface ShadowSoldiersPanelProps {
  characterId: string;
  characterLevel: number;
}

// Enhanced rank colors with System Ascendant theme
const rankColors: Record<string, string> = {
  'General Grade': 'bg-arise-violet/20 text-arise-violet border-arise-violet/40 shadow-[0_0_10px_hsl(var(--arise-violet)/0.3)]',
  'Marshal Grade': 'bg-shadow-purple/20 text-shadow-purple border-shadow-purple/40 shadow-[0_0_8px_hsl(var(--shadow-purple)/0.3)]',
  'Elite Knight Grade': 'bg-shadow-blue/20 text-shadow-blue border-shadow-blue/40 shadow-[0_0_6px_hsl(var(--shadow-blue)/0.3)]',
  'Knight Grade': 'bg-primary/20 text-primary border-primary/40',
  'Soldier Grade': 'bg-muted text-muted-foreground border-muted',
};

// Type icons with thematic styling
const typeIcons: Record<string, { icon: React.ReactNode; color: string }> = {
  knight: { icon: <Sword className="h-4 w-4" />, color: 'text-crimson-knight' },
  insect: { icon: <Zap className="h-4 w-4" />, color: 'text-gilded-reaper' },
  tank: { icon: <Shield className="h-4 w-4" />, color: 'text-silver-commander' },
  berserker: { icon: <Sword className="h-4 w-4" />, color: 'text-gate-a' },
  beast: { icon: <Dog className="h-4 w-4" />, color: 'text-shadow-purple' },
  mage: { icon: <Flame className="h-4 w-4" />, color: 'text-gate-a' },
  assassin: { icon: <Crosshair className="h-4 w-4" />, color: 'text-shadow-blue' },
  dragon: { icon: <Bird className="h-4 w-4" />, color: 'text-arise-violet' },
  giant: { icon: <Mountain className="h-4 w-4" />, color: 'text-monarch-gold' },
};

export function ShadowSoldiersPanel({ characterId, characterLevel }: ShadowSoldiersPanelProps) {
  const [selectedSoldier, setSelectedSoldier] = useState<ShadowSoldier | null>(null);
  const { data: mySoldiers = [] } = useCharacterShadowSoldiers(characterId);
  const { data: allSoldiers = [] } = useCompendiumShadowSoldiers();
  const { data: monarchUnlocks = [] } = useCharacterMonarchUnlocks(characterId);
  const extractSoldier = useExtractShadowSoldier();
  const toggleSummon = useToggleSummon();
  const updateHP = useUpdateSoldierHP();

  // Check if character has Umbral Monarch unlock
  const hasUmbralMonarch = monarchUnlocks.some((unlock) => {
    const theme = unlock.monarch?.theme?.toLowerCase() || '';
    const name = normalizeMonarchSearch(unlock.monarch?.name || '').toLowerCase();
    return theme.includes('umbral') || name.includes('umbral monarch');
  });
  const umbralTitle = `Umbral ${MONARCH_LABEL}`;
  
  // Get soldiers this character can extract
  const extractedIds = new Set(mySoldiers.map(s => s.soldier_id));
  const availableSoldiers = allSoldiers.filter(s => {
    if (extractedIds.has(s.id)) return false;
    
    // Parse requirements
    const req = s.summon_requirements || '';
    const levelMatch = req.match(/Level (\d+)\+/);
    const requiredLevel = levelMatch ? parseInt(levelMatch[1]) : 0;
    
    return characterLevel >= requiredLevel && hasUmbralMonarch;
  });

  const summonedCount = mySoldiers.filter(s => s.is_summoned).length;

  const handleHPChange = (soldierId: string, currentHp: number, maxHp: number, delta: number) => {
    const newHp = Math.max(0, Math.min(maxHp, currentHp + delta));
    updateHP.mutate({ characterId, shadowSoldierId: soldierId, currentHp: newHp });
  };

  if (!hasUmbralMonarch) {
    return (
      <SystemWindow title="Umbral Legion" variant="monarch">
        <div className="text-center py-8">
          <Ghost className="h-12 w-12 text-shadow-purple/40 mx-auto mb-4" />
          <p className="text-muted-foreground font-heading mb-2">
            The Umbral Legion awaits a worthy commander
          </p>
          <p className="text-sm text-muted-foreground">
            Unlock the <span className="text-shadow-purple">{umbralTitle}</span> overlay through a quest to command the Umbral Legion.
          </p>
        </div>
      </SystemWindow>
    );
  }

  return (
    <SystemWindow title="UMBRAL LEGION - ASCEND" variant="arise" className="border-shadow-purple/40">
      <div className="space-y-4">
        {/* Army Status Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-shadow-purple/20 flex items-center justify-center">
              <Skull className="h-5 w-5 text-shadow-purple" />
            </div>
            <div>
              <p className="font-heading text-sm text-muted-foreground">Legion Strength</p>
              <p className="font-display text-lg text-shadow-purple">{mySoldiers.length} Legionnaires</p>
            </div>
          </div>
          <Badge 
            variant="outline" 
            className="bg-arise-violet/10 text-arise-violet border-arise-violet/40 font-display"
          >
            {summonedCount} Summoned
          </Badge>
        </div>

        <Separator className="bg-shadow-purple/20" />

        {/* Summoned Soldiers */}
        {mySoldiers.length > 0 ? (
          <div className="space-y-3">
            {mySoldiers.map((css, index) => {
              const soldier = css.soldier;
              if (!soldier) return null;
              
              const hpPercent = (css.current_hp / soldier.hit_points) * 100;
              const typeData = typeIcons[soldier.shadow_type] || { icon: <Ghost className="h-4 w-4" />, color: 'text-shadow-purple' };
              
              return (
                <div
                  key={css.id}
                  className={cn(
                    "p-4 rounded-lg border transition-all duration-300",
                    css.is_summoned 
                      ? "border-shadow-purple/50 bg-shadow-purple/5 shadow-[0_0_15px_hsl(var(--shadow-purple)/0.15)]" 
                      : "border-border bg-background/50 hover:border-shadow-purple/30",
                    index < 3 && "animate-arise"
                  )}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded-lg bg-card", typeData.color)}>
                        {typeData.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={cn("font-heading font-semibold", css.is_summoned && "text-shadow-purple")}>
                            {formatMonarchVernacular(css.nickname || soldier.name)}
                          </span>
                          <Badge 
                            variant="outline" 
                            className={cn("text-xs", rankColors[soldier.rank] || '')}
                          >
                            {soldier.rank}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground italic">{formatMonarchVernacular(soldier.title)}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant={css.is_summoned ? 'default' : 'outline'}
                      onClick={() => toggleSummon.mutate({
                        characterId,
                        shadowSoldierId: css.id,
                        summon: !css.is_summoned,
                      })}
                      className={cn(
                        "font-arise tracking-wider",
                        css.is_summoned 
                          ? "bg-shadow-purple hover:bg-shadow-purple/80 shadow-[0_0_10px_hsl(var(--shadow-purple)/0.4)]" 
                          : "border-shadow-purple/40 hover:border-shadow-purple hover:bg-shadow-purple/10"
                      )}
                    >
                      {css.is_summoned ? 'Dismiss' : 'ASCEND'}
                    </Button>
                  </div>
                  
                  {css.is_summoned && (
                    <>
                      <div className="flex items-center gap-3 mb-3">
                        <Heart className="h-4 w-4 text-gate-a shrink-0" />
                        <div className="flex-1 relative">
                          <Progress 
                            value={hpPercent} 
                            className="h-2 bg-muted"
                          />
                          <div 
                            className="absolute inset-0 rounded-full opacity-30"
                            style={{
                              background: `linear-gradient(90deg, hsl(var(--gate-a)) 0%, hsl(var(--shadow-purple)) ${hpPercent}%, transparent ${hpPercent}%)`,
                              filter: 'blur(4px)'
                            }}
                          />
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 hover:bg-gate-a/20"
                            onClick={() => handleHPChange(css.id, css.current_hp, soldier.hit_points, -10)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-display w-20 text-center text-gate-a">
                            {css.current_hp}/{soldier.hit_points}
                          </span>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 hover:bg-accent/20"
                            onClick={() => handleHPChange(css.id, css.current_hp, soldier.hit_points, 10)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex gap-4 text-xs font-heading">
                        <span className="text-shadow-blue">
                          <Shield className="h-3 w-3 inline mr-1" />
                          AC {soldier.armor_class}
                        </span>
                        <span className="text-accent">
                          Speed {soldier.speed} ft
                        </span>
                        <span className="text-monarch-gold">
                          <Crown className="h-3 w-3 inline mr-1" />
                          Bond Lv.{css.bond_level}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6">
            <Ghost className="h-10 w-10 text-shadow-purple/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground font-heading">
              No Umbral Legion extracted yet
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Extract fallen foes to build your Umbral Legion
            </p>
          </div>
        )}

        {/* Extract New Soldier */}
        {availableSoldiers.length > 0 && (
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full border-arise-violet/40 hover:border-arise-violet hover:bg-arise-violet/10 font-arise tracking-wider"
              >
                <Skull className="h-4 w-4 mr-2 text-arise-violet" />
                EXTRACT Umbral Legionnaire
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-card border-shadow-purple/40">
              <DialogHeader>
                <DialogTitle className="font-arise text-xl gradient-text-arise">
                  Available Shadows
                </DialogTitle>
              </DialogHeader>
              <ScrollArea className="max-h-[60vh]">
                <div className="space-y-4 p-1">
                  {availableSoldiers.map((soldier) => {
                    const typeData = typeIcons[soldier.shadow_type] || { icon: <Ghost className="h-5 w-5" />, color: 'text-shadow-purple' };
                    
                    return (
                      <Card
                        key={soldier.id}
                        className={cn(
                          "cursor-pointer transition-all duration-300 border-border hover:border-shadow-purple/50",
                          selectedSoldier?.id === soldier.id && "border-arise-violet shadow-[0_0_20px_hsl(var(--arise-violet)/0.2)]"
                        )}
                        onClick={() => setSelectedSoldier(soldier)}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={cn("p-2 rounded-lg bg-card border border-border", typeData.color)}>
                                {typeData.icon}
                              </div>
                              <div>
                                <CardTitle className="text-lg font-heading">{formatMonarchVernacular(soldier.name)}</CardTitle>
                                <p className="text-sm text-muted-foreground italic">{formatMonarchVernacular(soldier.title)}</p>
                              </div>
                            </div>
                            <Badge className={cn("font-display", rankColors[soldier.rank] || '')}>
                              {soldier.rank}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">{formatMonarchVernacular(soldier.description)}</p>
                          
                          <div className="flex gap-4 text-xs font-heading mb-4">
                            <span className="text-gate-a">HP {soldier.hit_points}</span>
                            <span className="text-shadow-blue">AC {soldier.armor_class}</span>
                            <span className="text-accent">Speed {soldier.speed} ft</span>
                          </div>
                          
                          <Separator className="my-3 bg-shadow-purple/20" />
                          
                          <div className="space-y-2">
                            <p className="text-xs font-display text-shadow-purple tracking-wider">ABILITIES:</p>
                            {soldier.abilities.map((ability, i) => (
                              <div key={i} className="text-xs p-2 rounded bg-muted/50">
                                <span className="font-heading font-semibold text-foreground">{formatMonarchVernacular(ability.name)}</span>
                                <Badge variant="outline" className="ml-2 text-[10px] h-4">
                                  {ability.action_type}
                                </Badge>
                              </div>
                            ))}
                          </div>
                          
                          {selectedSoldier?.id === soldier.id && (
                            <Button
                              className="w-full mt-4 font-arise tracking-wider bg-arise-violet hover:bg-arise-violet/80 shadow-[0_0_15px_hsl(var(--arise-violet)/0.4)]"
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
                              <Skull className="h-4 w-4 mr-2" />
                              ASCEND - {formatMonarchVernacular(soldier.name)}
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </SystemWindow>
  );
}


