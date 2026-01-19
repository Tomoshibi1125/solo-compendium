import { useEffect, useState } from 'react';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { Heart, Shield, Footprints, Skull, Swords, Crown, Zap, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CompendiumImage } from '@/components/compendium/CompendiumImage';
import { StatBlock, StatRow, StatSection } from '@/components/compendium/StatBlock';
import { TableOfContents } from '@/components/compendium/TableOfContents';

interface MonsterData {
  id: string;
  name: string;
  display_name?: string | null;
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
  image_url?: string | null;
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

// Enhanced gate rank colors with Solo Leveling theme
const gateRankColors: Record<string, { bg: string; text: string; glow: string }> = {
  'E': { bg: 'bg-gate-e/20', text: 'text-gate-e', glow: '' },
  'D': { bg: 'bg-gate-d/20', text: 'text-gate-d', glow: '' },
  'C': { bg: 'bg-gate-c/20', text: 'text-gate-c', glow: '' },
  'B': { bg: 'bg-gate-b/20', text: 'text-gate-b', glow: 'shadow-[0_0_8px_hsl(var(--gate-b)/0.4)]' },
  'A': { bg: 'bg-gate-a/20', text: 'text-gate-a', glow: 'shadow-[0_0_10px_hsl(var(--gate-a)/0.5)]' },
  'S': { bg: 'bg-gate-s/20', text: 'text-gate-s', glow: 'shadow-[0_0_15px_hsl(var(--gate-s)/0.6)]' },
  'SS': { bg: 'bg-gate-ss/20', text: 'text-gate-ss', glow: 'shadow-[0_0_20px_hsl(var(--gate-ss)/0.7)]' },
};

const getModifier = (score: number) => {
  const mod = Math.floor((score - 10) / 2);
  return mod >= 0 ? `+${mod}` : `${mod}`;
};

export const MonsterDetail = ({ data }: { data: MonsterData }) => {
  const [actions, setActions] = useState<MonsterAction[]>([]);
  const [traits, setTraits] = useState<MonsterTrait[]>([]);

  useEffect(() => {
    const fetchRelatedData = async () => {
      const [actionsRes, traitsRes] = await Promise.all([
        supabase.from('compendium_monster_actions').select('*').eq('monster_id', data.id),
        supabase.from('compendium_monster_traits').select('*').eq('monster_id', data.id),
      ]);

      if (actionsRes.data) setActions(actionsRes.data.map(action => ({
        ...action,
        attack_bonus: action.attack_bonus ?? undefined,
        damage: action.damage ?? undefined,
        damage_type: action.damage_type ?? undefined,
        recharge: action.recharge ?? undefined,
        legendary_cost: action.legendary_cost ?? undefined,
        action_type: action.action_type ?? undefined,
        aliases: action.aliases ?? undefined,
        display_name: action.display_name ?? undefined
      })));
      if (traitsRes.data) setTraits(traitsRes.data.map(trait => ({
        ...trait,
        display_name: trait.display_name ?? undefined,
        aliases: trait.aliases ?? undefined
      })));
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

  const gateStyle = data.gate_rank ? gateRankColors[data.gate_rank] : null;
  const isBossOrNamedNPC = data.is_boss || data.tags?.includes('named-npc') || data.tags?.includes('named-boss') || data.tags?.includes('monarch');
  const displayName = data.display_name || data.name;

  // Generate TOC items for long pages
  const tocItems = [
    { id: 'monster-header', title: displayName, level: 1 },
    { id: 'monster-stats', title: 'Core Stats', level: 2 },
    { id: 'monster-abilities', title: 'Ability Scores', level: 2 },
  ];

  if (traits.length > 0) tocItems.push({ id: 'monster-traits', title: 'Traits', level: 2 });
  if (regularActions.length > 0) tocItems.push({ id: 'monster-actions', title: 'Actions', level: 2 });
  if (legendaryActions.length > 0) tocItems.push({ id: 'monster-legendary', title: 'Legendary Actions', level: 2 });
  if (data.description) tocItems.push({ id: 'monster-description', title: 'Description', level: 2 });

  return (
    <div className="space-y-6">
      {/* Hero Image */}
      {data.image_url && (
        <div className="w-full">
          <CompendiumImage
            src={data.image_url}
            alt={displayName}
            size="hero"
            aspectRatio="landscape"
            className="w-full rounded-lg"
            fallbackIcon={<Skull className="w-32 h-32 text-muted-foreground" />}
          />
        </div>
      )}

      {/* Header */}
      <SystemWindow
        title={displayName.toUpperCase()}
        variant={data.is_boss ? 'alert' : data.tags?.includes('monarch') ? 'arise' : 'default'}
        className={cn(
          data.is_boss && 'border-gate-a/50 border-2',
          data.tags?.includes('monarch') && 'border-arise-violet/50 border-2',
          gateStyle?.glow
        )}
      >
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted-foreground capitalize font-heading">
              {data.size} {data.creature_type}
              {data.alignment && `, ${data.alignment}`}
            </span>
            {data.gate_rank && gateStyle && (
              <Badge className={cn(gateStyle.bg, gateStyle.text, 'font-display tracking-wider', gateStyle.glow)}>
                {data.gate_rank}-Rank Gate
              </Badge>
            )}
            {data.is_boss && (
              <Badge variant="destructive" className="font-display tracking-wider shadow-[0_0_10px_hsl(var(--destructive)/0.5)]">
                <Skull className="h-3 w-3 mr-1" />
                BOSS
              </Badge>
            )}
            {data.tags?.includes('named-npc') && (
              <Badge variant="outline" className="border-shadow-purple/50 text-shadow-purple font-heading">
                Named NPC
              </Badge>
            )}
            {data.tags?.includes('named-boss') && (
              <Badge variant="outline" className="border-monarch-gold/50 text-monarch-gold font-heading">
                <Crown className="h-3 w-3 mr-1" />
                Named Boss
              </Badge>
            )}
            {data.tags?.includes('monarch') && (
              <Badge variant="outline" className="border-arise-violet/50 text-arise-violet font-heading shadow-[0_0_10px_hsl(var(--arise-violet)/0.4)]">
                <Zap className="h-3 w-3 mr-1" />
                Monarch
              </Badge>
            )}
            {data.tags?.includes('guild-master') && (
              <Badge variant="outline" className="border-shadow-blue/50 text-shadow-blue font-heading">
                Guild Master
              </Badge>
            )}
          </div>
          {data.lore && (
            <p className="text-muted-foreground italic border-l-2 border-shadow-purple/40 pl-4 mt-4 leading-relaxed">
              {data.lore}
            </p>
          )}
        </div>
      </SystemWindow>

      {/* Core Stats */}
      <div className="grid grid-cols-3 md:grid-cols-5 gap-4" id="monster-stats">
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
      <StatBlock
        title="ABILITY SCORES"
        copyable
        copyContent={`${displayName} - Ability Scores: STR ${data.str} (${getModifier(data.str)}), AGI ${data.agi} (${getModifier(data.agi)}), VIT ${data.vit} (${getModifier(data.vit)}), INT ${data.int} (${getModifier(data.int)}), SENSE ${data.sense} (${getModifier(data.sense)}), PRE ${data.pre} (${getModifier(data.pre)})`}
        id="monster-abilities"
      >
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 text-center">
          {[
            { name: 'STR', value: data.str },
            { name: 'AGI', value: data.agi },
            { name: 'VIT', value: data.vit },
            { name: 'INT', value: data.int },
            { name: 'SENSE', value: data.sense },
            { name: 'PRE', value: data.pre },
          ].map((stat) => (
            <div key={stat.name} className="glass-card p-3">
              <div className="font-display text-xs text-muted-foreground mb-1">{stat.name}</div>
              <div className="font-display text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm font-semibold text-primary">{getModifier(stat.value)}</div>
            </div>
          ))}
        </div>
      </StatBlock>

      {/* Defenses */}
      <div className="grid md:grid-cols-2 gap-4">
        {(data.damage_vulnerabilities?.length || data.damage_resistances?.length || data.damage_immunities?.length) ? (
          <SystemWindow title="DAMAGE MODIFIERS">
            <div className="space-y-2">
              {data.damage_vulnerabilities && data.damage_vulnerabilities.length > 0 && (
                <div>
                  <span className="text-red-400 font-heading text-sm">Vulnerabilities: </span>
                  <span className="text-muted-foreground">{data.damage_vulnerabilities.join(', ')}</span>
                </div>
              )}
              {data.damage_resistances && data.damage_resistances.length > 0 && (
                <div>
                  <span className="text-yellow-400 font-heading text-sm">Resistances: </span>
                  <span className="text-muted-foreground">{data.damage_resistances.join(', ')}</span>
                </div>
              )}
              {data.damage_immunities && data.damage_immunities.length > 0 && (
                <div>
                  <span className="text-black font-heading text-sm">Immunities: </span>
                  <span className="text-muted-foreground">{data.damage_immunities.join(', ')}</span>
                </div>
              )}
            </div>
          </SystemWindow>
        ) : null}

        {data.condition_immunities && data.condition_immunities.length > 0 && (
          <SystemWindow title="CONDITION IMMUNITIES">
            <div className="flex flex-wrap gap-1">
              {data.condition_immunities.map((condition) => (
                <Badge key={condition} variant="outline">{condition}</Badge>
              ))}
            </div>
          </SystemWindow>
        )}
      </div>

      {/* Traits */}
      {traits.length > 0 && (
        <StatBlock title="TRAITS" id="monster-traits">
          <StatSection title="">
            {traits.map((trait) => (
              <div key={trait.id} className="mb-4 last:mb-0">
                <h4 className="font-heading font-semibold text-primary mb-1 text-base">{trait.name}</h4>
                <p className="text-sm text-foreground leading-relaxed">{trait.description}</p>
              </div>
            ))}
          </StatSection>
        </StatBlock>
      )}

      {/* Actions */}
      {regularActions.length > 0 && (
        <StatBlock title="ACTIONS" id="monster-actions">
          <StatSection title="">
            {regularActions.map((action) => (
              <div key={action.id} className="mb-4 last:mb-0 pb-4 last:pb-0 border-b border-border/30 last:border-b-0">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-heading font-semibold text-primary text-base">{action.name}</h4>
                  {action.recharge && <Badge variant="secondary" className="text-xs">{action.recharge}</Badge>}
                </div>
                <p className="text-sm text-foreground leading-relaxed mb-1">{action.description}</p>
                {action.damage && (
                  <p className="text-sm text-foreground font-medium mt-2">
                    <span className="font-semibold">Damage:</span> {action.damage} {action.damage_type}
                    {action.attack_bonus !== null && action.attack_bonus !== undefined && (
                      <span className="ml-2 text-muted-foreground">({action.attack_bonus >= 0 ? '+' : ''}{action.attack_bonus} to hit)</span>
                    )}
                  </p>
                )}
              </div>
            ))}
          </StatSection>
        </StatBlock>
      )}

      {/* Legendary Actions */}
      {legendaryActions.length > 0 && (
        <StatBlock title="LEGENDARY ACTIONS" className="border-amber-500/30 border-2" id="monster-legendary">
          <p className="text-sm text-foreground mb-4 font-medium leading-relaxed">
            The creature can take 3 legendary actions, choosing from the options below.
          </p>
          <StatSection title="">
            {legendaryActions.map((action) => (
              <div key={action.id} className="mb-4 last:mb-0 pb-4 last:pb-0 border-b border-border/30 last:border-b-0">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-heading font-semibold text-amber-400 text-base">{action.name}</h4>
                  {action.legendary_cost && action.legendary_cost > 1 && (
                    <Badge variant="outline" className="text-xs">Costs {action.legendary_cost}</Badge>
                  )}
                </div>
                <p className="text-sm text-foreground leading-relaxed">{action.description}</p>
              </div>
            ))}
          </StatSection>
        </StatBlock>
      )}

      {data.description && (
        <StatBlock title="DESCRIPTION" id="monster-description">
          <p className="text-foreground leading-relaxed text-base">{data.description}</p>
        </StatBlock>
      )}
    </div>
  );
};