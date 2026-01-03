import { useEffect, useState } from 'react';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { Heart, Shield, Footprints, Skull, Swords } from 'lucide-react';

interface MonsterData {
  id: string;
  name: string;
  description?: string;
  lore?: string;
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
  is_boss: boolean;
  tags?: string[];
}

interface MonsterAction {
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

interface MonsterTrait {
  id: string;
  name: string;
  description: string;
}

const gateRankColors: Record<string, string> = {
  'E': 'bg-gray-500',
  'D': 'bg-green-500',
  'C': 'bg-blue-500',
  'B': 'bg-purple-500',
  'A': 'bg-orange-500',
  'S': 'bg-red-500',
};

const getModifier = (score: number) => {
  const mod = Math.floor((score - 10) / 2);
  return mod >= 0 ? `+${mod}` : `${mod}`;
};

export const MonsterDetail = ({ data }: { data: MonsterData }) => {
  const [actions, setActions] = useState<MonsterAction[]>([]);
  const [traits, setTraits] = useState<MonsterTrait[]>([]);

  useEffect(() => {
    fetchRelatedData();
  }, [data.id]);

  const fetchRelatedData = async () => {
    const [actionsRes, traitsRes] = await Promise.all([
      supabase.from('compendium_monster_actions').select('*').eq('monster_id', data.id),
      supabase.from('compendium_monster_traits').select('*').eq('monster_id', data.id),
    ]);

    if (actionsRes.data) setActions(actionsRes.data);
    if (traitsRes.data) setTraits(traitsRes.data);
  };

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <SystemWindow 
        title={data.name.toUpperCase()} 
        className={data.is_boss ? 'border-red-500/50 border-2' : ''}
      >
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted-foreground capitalize">
              {data.size} {data.creature_type}
              {data.alignment && `, ${data.alignment}`}
            </span>
            {data.gate_rank && (
              <Badge className={`${gateRankColors[data.gate_rank]} text-white`}>
                {data.gate_rank}-Rank
              </Badge>
            )}
            {data.is_boss && <Badge variant="destructive">Boss</Badge>}
          </div>
          {data.lore && (
            <p className="text-muted-foreground italic border-l-2 border-primary/30 pl-4 mt-4">
              {data.lore}
            </p>
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
        <SystemWindow title="TRAITS">
          <div className="space-y-4">
            {traits.map((trait) => (
              <div key={trait.id}>
                <h4 className="font-heading font-semibold text-primary">{trait.name}</h4>
                <p className="text-sm text-muted-foreground">{trait.description}</p>
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
                    {action.attack_bonus !== null && ` (${action.attack_bonus >= 0 ? '+' : ''}${action.attack_bonus} to hit)`}
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
            The creature can take 3 legendary actions, choosing from the options below.
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