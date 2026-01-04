import { useEffect, useState } from 'react';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Heart, Shield, Footprints, Skull, Swords, Sparkles, Crown } from 'lucide-react';

interface ShadowSoldierData {
  id: string;
  name: string;
  rank: string;
  tier: number;
  description?: string;
  lore?: string;
  summoning_lore?: string;
  size: string;
  creature_type: string;
  alignment?: string;
  armor_class: number;
  armor_type?: string;
  hit_points_average: number;
  hit_points_formula: string;
  speed_walk?: number;
  speed_fly?: number;
  speed_swim?: number;
  speed_climb?: number;
  speed_burrow?: number;
  str: number;
  agi: number;
  vit: number;
  int: number;
  sense: number;
  pre: number;
  saving_throws?: Record<string, number>;
  skills?: Record<string, number>;
  damage_vulnerabilities?: string[];
  damage_resistances?: string[];
  damage_immunities?: string[];
  condition_immunities?: string[];
  senses?: Record<string, string>;
  languages?: string[];
  cr: string;
  xp?: number;
  gate_rank?: string;
  is_elite: boolean;
  is_named: boolean;
  shadow_energy?: number;
  max_summoned?: number;
  summoning_requirement?: string;
  tags?: string[];
}

interface ShadowSoldierAction {
  id: string;
  name: string;
  description: string;
  action_type: string;
  attack_bonus?: number;
  damage?: string;
  damage_type?: string;
  recharge?: string;
  legendary_cost?: number;
}

interface ShadowSoldierTrait {
  id: string;
  name: string;
  description: string;
}

interface ShadowSoldierAbility {
  id: string;
  name: string;
  description: string;
  ability_type: string;
  uses_per_day?: number;
  recharge?: string;
}

const gateRankColors: Record<string, string> = {
  'E': 'bg-gray-500',
  'D': 'bg-green-500',
  'C': 'bg-blue-500',
  'B': 'bg-purple-500',
  'A': 'bg-orange-500',
  'S': 'bg-red-500',
};

const tierColors: Record<number, string> = {
  1: 'bg-gray-600',
  2: 'bg-blue-600',
  3: 'bg-purple-600',
  4: 'bg-orange-600',
  5: 'bg-red-600',
};

const getModifier = (score: number) => {
  const mod = Math.floor((score - 10) / 2);
  return mod >= 0 ? `+${mod}` : `${mod}`;
};

export const ShadowSoldiersDetail = ({ data }: { data: ShadowSoldierData }) => {
  const [actions, setActions] = useState<ShadowSoldierAction[]>([]);
  const [traits, setTraits] = useState<ShadowSoldierTrait[]>([]);
  const [abilities, setAbilities] = useState<ShadowSoldierAbility[]>([]);
  const [showAriseAnimation, setShowAriseAnimation] = useState(false);

  useEffect(() => {
    const fetchRelatedData = async () => {
      const [actionsRes, traitsRes, abilitiesRes] = await Promise.all([
        supabase.from('compendium_shadow_soldier_actions').select('*').eq('shadow_soldier_id', data.id),
        supabase.from('compendium_shadow_soldier_traits').select('*').eq('shadow_soldier_id', data.id),
        supabase.from('compendium_shadow_soldier_abilities').select('*').eq('shadow_soldier_id', data.id),
      ]);

      if (actionsRes.data) setActions(actionsRes.data);
      if (traitsRes.data) setTraits(traitsRes.data);
      if (abilitiesRes.data) setAbilities(abilitiesRes.data);
    };

    fetchRelatedData();
  }, [data.id]);

  const speeds = [
    data.speed_walk && `${data.speed_walk} ft.`,
    data.speed_fly && `fly ${data.speed_fly} ft.`,
    data.speed_swim && `swim ${data.speed_swim} ft.`,
    data.speed_climb && `climb ${data.speed_climb} ft.`,
    data.speed_burrow && `burrow ${data.speed_burrow} ft.`,
  ].filter(Boolean).join(', ');

  const regularActions = actions.filter(a => a.action_type === 'action');
  const bonusActions = actions.filter(a => a.action_type === 'bonus');
  const reactions = actions.filter(a => a.action_type === 'reaction');
  const legendaryActions = actions.filter(a => a.action_type === 'legendary');

  const handleAriseClick = () => {
    setShowAriseAnimation(true);
    setTimeout(() => {
      setShowAriseAnimation(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* ARISE Animation Overlay */}
      {showAriseAnimation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="arise-animation-container">
            <div className="arise-text">ARISE</div>
            <div className="arise-shadow-effect"></div>
          </div>
        </div>
      )}

      {/* Header */}
      <SystemWindow 
        title={data.name.toUpperCase()} 
        className={data.is_named ? 'border-purple-500/50 border-2 shadow-monarch-glow' : data.is_elite ? 'border-blue-500/50 border-2' : ''}
      >
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted-foreground capitalize">
              {data.size} {data.creature_type}
              {data.alignment && `, ${data.alignment}`}
            </span>
            <Badge className={`${tierColors[data.tier]} text-white`}>
              Tier {data.tier}
            </Badge>
            <Badge variant="outline" className="border-purple-500/50 text-purple-400">
              {data.rank}
            </Badge>
            {data.gate_rank && (
              <Badge className={`${gateRankColors[data.gate_rank]} text-white`}>
                {data.gate_rank}-Rank
              </Badge>
            )}
            {data.is_named && (
              <Badge variant="outline" className="border-purple-500/50 text-purple-400">
                <Crown className="w-3 h-3 mr-1" />
                Named Shadow
              </Badge>
            )}
            {data.is_elite && !data.is_named && (
              <Badge variant="outline" className="border-blue-500/50 text-blue-400">
                Elite
              </Badge>
            )}
            {data.shadow_energy && (
              <Badge variant="secondary">
                <Sparkles className="w-3 h-3 mr-1" />
                {data.shadow_energy} Shadow Energy
              </Badge>
            )}
          </div>

          {data.lore && (
            <p className="text-muted-foreground italic border-l-2 border-purple-500/30 pl-4 mt-4">
              {data.lore}
            </p>
          )}

          {data.summoning_lore && (
            <div className="mt-4 p-4 bg-purple-950/30 border border-purple-500/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <h4 className="font-heading text-purple-400">Summoning</h4>
              </div>
              <p className="text-sm text-muted-foreground italic">{data.summoning_lore}</p>
              <Button
                onClick={handleAriseClick}
                variant="outline"
                className="mt-3 border-purple-500/50 text-purple-400 hover:bg-purple-500/20"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Witness the Summoning
              </Button>
            </div>
          )}

          {data.summoning_requirement && (
            <div className="mt-2">
              <span className="text-sm text-muted-foreground">
                <strong>Requirement:</strong> {data.summoning_requirement}
              </span>
            </div>
          )}

          {data.max_summoned && data.max_summoned > 1 && (
            <div className="mt-2">
              <span className="text-sm text-muted-foreground">
                <strong>Max Summoned:</strong> {data.max_summoned}
              </span>
            </div>
          )}
        </div>
      </SystemWindow>

      {/* Core Stats */}
      <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
        <SystemWindow title="ARMOR CLASS" compact>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-400" />
            <span className="font-display text-2xl">{data.armor_class}</span>
          </div>
          {data.armor_type && (
            <span className="text-xs text-muted-foreground">{data.armor_type}</span>
          )}
        </SystemWindow>
        
        <SystemWindow title="HIT POINTS" compact>
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-400" />
            <span className="font-display text-2xl">{data.hit_points_average}</span>
          </div>
          <span className="text-xs text-muted-foreground">{data.hit_points_formula}</span>
        </SystemWindow>
        
        <SystemWindow title="SPEED" compact>
          <div className="flex items-center gap-2">
            <Footprints className="w-5 h-5 text-green-400" />
            <span className="font-heading text-sm">{speeds}</span>
          </div>
        </SystemWindow>
        
        <SystemWindow title="CR" compact>
          <div className="flex items-center gap-2">
            <Skull className="w-5 h-5 text-purple-400" />
            <span className="font-display text-2xl">{data.cr}</span>
          </div>
          {data.xp && <span className="text-xs text-muted-foreground">{data.xp} XP</span>}
        </SystemWindow>
        
        <SystemWindow title="GATE RANK" compact>
          <div className="flex items-center gap-2">
            <Swords className="w-5 h-5 text-orange-400" />
            <span className="font-display text-2xl">{data.gate_rank || '—'}</span>
          </div>
        </SystemWindow>
      </div>

      {/* Ability Scores */}
      <SystemWindow title="ABILITY SCORES">
        <div className="grid grid-cols-6 gap-4 text-center">
          {[
            { name: 'STR', value: data.str },
            { name: 'AGI', value: data.agi },
            { name: 'VIT', value: data.vit },
            { name: 'INT', value: data.int },
            { name: 'SENSE', value: data.sense },
            { name: 'PRE', value: data.pre },
          ].map((stat) => (
            <div key={stat.name} className="glass-card p-3">
              <div className="font-display text-xs text-muted-foreground">{stat.name}</div>
              <div className="font-display text-xl">{stat.value}</div>
              <div className="text-sm text-primary">{getModifier(stat.value)}</div>
            </div>
          ))}
        </div>
      </SystemWindow>

      {/* Defenses */}
      <div className="grid md:grid-cols-2 gap-4">
        {(data.damage_vulnerabilities?.length || data.damage_resistances?.length || data.damage_immunities?.length) ? (
          <SystemWindow title="DAMAGE MODIFIERS">
            <div className="space-y-2">
              {data.damage_vulnerabilities?.length > 0 && (
                <div>
                  <span className="text-red-400 font-heading text-sm">Vulnerabilities: </span>
                  <span className="text-muted-foreground">{data.damage_vulnerabilities.join(', ')}</span>
                </div>
              )}
              {data.damage_resistances?.length > 0 && (
                <div>
                  <span className="text-yellow-400 font-heading text-sm">Resistances: </span>
                  <span className="text-muted-foreground">{data.damage_resistances.join(', ')}</span>
                </div>
              )}
              {data.damage_immunities?.length > 0 && (
                <div>
                  <span className="text-green-400 font-heading text-sm">Immunities: </span>
                  <span className="text-muted-foreground">{data.damage_immunities.join(', ')}</span>
                </div>
              )}
            </div>
          </SystemWindow>
        ) : null}

        {data.condition_immunities?.length > 0 && (
          <SystemWindow title="CONDITION IMMUNITIES">
            <div className="flex flex-wrap gap-2">
              {data.condition_immunities.map((condition) => (
                <Badge key={condition} variant="outline">{condition}</Badge>
              ))}
            </div>
          </SystemWindow>
        )}
      </div>

      {/* Traits */}
      {traits.length > 0 && (
        <SystemWindow title="TRAITS" className="border-purple-500/30">
          <div className="space-y-4">
            {traits.map((trait) => (
              <div key={trait.id}>
                <h4 className="font-heading font-semibold text-purple-400">{trait.name}</h4>
                <p className="text-sm text-muted-foreground">{trait.description}</p>
              </div>
            ))}
          </div>
        </SystemWindow>
      )}

      {/* Special Abilities */}
      {abilities.length > 0 && (
        <SystemWindow title="SPECIAL ABILITIES" className="border-purple-500/30">
          <div className="space-y-4">
            {abilities.map((ability) => (
              <div key={ability.id}>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-heading font-semibold text-purple-400">{ability.name}</h4>
                  <Badge variant="outline" className="text-xs">
                    {ability.ability_type}
                  </Badge>
                  {ability.recharge && <Badge variant="secondary">{ability.recharge}</Badge>}
                  {ability.uses_per_day && (
                    <Badge variant="secondary">{ability.uses_per_day}/day</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{ability.description}</p>
              </div>
            ))}
          </div>
        </SystemWindow>
      )}

      {/* Actions */}
      {regularActions.length > 0 && (
        <SystemWindow title="ACTIONS">
          <div className="space-y-4">
            {regularActions.map((action) => (
              <div key={action.id}>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-heading font-semibold text-primary">{action.name}</h4>
                  {action.recharge && <Badge variant="secondary">{action.recharge}</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">{action.description}</p>
                {action.damage && (
                  <p className="text-sm text-foreground mt-1">
                    <strong>Damage:</strong> {action.damage} {action.damage_type}
                    {action.attack_bonus !== null && action.attack_bonus !== undefined && ` (${action.attack_bonus >= 0 ? '+' : ''}${action.attack_bonus} to hit)`}
                  </p>
                )}
              </div>
            ))}
          </div>
        </SystemWindow>
      )}

      {/* Legendary Actions */}
      {legendaryActions.length > 0 && (
        <SystemWindow title="LEGENDARY ACTIONS" className="border-amber-500/30">
          <p className="text-sm text-muted-foreground mb-4">
            The shadow soldier can take 3 legendary actions, choosing from the options below.
          </p>
          <div className="space-y-4">
            {legendaryActions.map((action) => (
              <div key={action.id}>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-heading font-semibold text-amber-400">{action.name}</h4>
                  {action.legendary_cost && action.legendary_cost > 1 && (
                    <Badge variant="outline">Costs {action.legendary_cost}</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </div>
            ))}
          </div>
        </SystemWindow>
      )}

      {data.description && (
        <SystemWindow title="DESCRIPTION">
          <p className="text-foreground">{data.description}</p>
        </SystemWindow>
      )}
    </div>
  );
};

