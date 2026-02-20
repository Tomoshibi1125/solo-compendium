import { useEffect, useState } from 'react';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Badge } from '@/components/ui/badge';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { Heart, Shield, Footprints, Skull, Swords, Crown, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CompendiumImage } from '@/components/compendium/CompendiumImage';
import { StatBlock, StatSection } from '@/components/compendium/StatBlock';
import { formatMonarchVernacular, MONARCH_LABEL } from '@/lib/vernacular';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { setPendingResolution, type ActionResolutionPayload } from '@/lib/actionResolution';

interface MonsterData {
  id: string;
  name: string;
  display_name?: string | null;
  description?: string;
  lore?: string;
  size?: string | null;
  creature_type?: string | null;
  alignment?: string;
  armor_class?: number | null;
  armor_type?: string;
  hit_points_average?: number | null;
  hit_points_formula?: string | null;
  speed_walk?: number;
  speed_fly?: number;
  speed_swim?: number;
  speed_climb?: number;
  speed_burrow?: number;
  str?: number | null;
  agi?: number | null;
  vit?: number | null;
  int?: number | null;
  sense?: number | null;
  pre?: number | null;
  saving_throws?: Record<string, number>;
  skills?: Record<string, number>;
  damage_vulnerabilities?: string[];
  damage_resistances?: string[];
  damage_immunities?: string[];
  condition_immunities?: string[];
  senses?: Record<string, string>;
  languages?: string[];
  cr?: string | null;
  xp?: number;
  gate_rank?: string;
  is_boss?: boolean;
  tags?: string[];
  image_url?: string | null;
  monster_actions?: Record<string, unknown>[] | null;
  monster_traits?: Record<string, unknown>[] | null;
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

// Enhanced gate rank colors with System Ascendant theme
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
  const navigate = useNavigate();
  const [actions, setActions] = useState<MonsterAction[]>([]);
  const [traits, setTraits] = useState<MonsterTrait[]>([]);

  const mapStaticAction = (a: Record<string, unknown>, idx: number): MonsterAction => {
    const name = typeof a.name === 'string' ? a.name : `Action ${idx + 1}`;
    const actionTypeRaw =
      (typeof a.action_type === 'string' ? a.action_type : null) ??
      (typeof a.action === 'string' ? a.action : null);

    const action_type =
      actionTypeRaw === 'bonus-action'
        ? 'bonus'
        : actionTypeRaw === 'reaction'
          ? 'reaction'
          : actionTypeRaw === 'legendary'
            ? 'legendary'
            : 'action';

    const attack_bonus =
      typeof a.attack_bonus === 'number'
        ? a.attack_bonus
        : typeof a.attackBonus === 'number'
          ? a.attackBonus
          : undefined;

    const damage = typeof a.damage === 'string' ? a.damage : undefined;
    const damage_type =
      typeof a.damage_type === 'string'
        ? a.damage_type
        : typeof a.damageType === 'string'
          ? a.damageType
          : undefined;

    const recharge =
      typeof a.recharge === 'string'
        ? a.recharge
        : typeof a.usage === 'string'
          ? a.usage
          : undefined;

    const legendary_cost =
      typeof a.legendary_cost === 'number'
        ? a.legendary_cost
        : typeof a.legendaryCost === 'number'
          ? a.legendaryCost
          : undefined;

    return {
      id: `${data.id}:static-action:${idx}`,
      name,
      description: typeof a.description === 'string' ? a.description : '',
      action_type,
      attack_bonus,
      damage,
      damage_type,
      recharge,
      legendary_cost,
    };
  };

  const mapStaticTrait = (t: Record<string, unknown>, idx: number): MonsterTrait => {
    const name = typeof t.name === 'string' ? t.name : `Trait ${idx + 1}`;
    return {
      id: `${data.id}:static-trait:${idx}`,
      name,
      description: typeof t.description === 'string' ? t.description : '',
    };
  };

  useEffect(() => {
    const fetchRelatedData = async () => {
      const staticActions = Array.isArray(data.monster_actions)
        ? data.monster_actions
        : null;
      const staticTraits = Array.isArray(data.monster_traits)
        ? data.monster_traits
        : null;

      // If Supabase isn't configured, rely entirely on embedded static data.
      if (!isSupabaseConfigured) {
        if (staticActions) {
          setActions(
            staticActions
              .map((a, idx) => mapStaticAction(a as Record<string, unknown>, idx))
              .filter((a) => a.description.trim().length > 0),
          );
        }

        if (staticTraits) {
          setTraits(
            staticTraits
              .map((t, idx) => mapStaticTrait(t as Record<string, unknown>, idx))
              .filter((t) => t.description.trim().length > 0),
          );
        }

        return;
      }

      const [actionsRes, traitsRes] = await Promise.all([
        supabase.from('compendium_monster_actions').select('*').eq('monster_id', data.id),
        supabase.from('compendium_monster_traits').select('*').eq('monster_id', data.id),
      ]);

      const remoteActions = actionsRes.data || [];
      const remoteTraits = traitsRes.data || [];

      if (remoteActions.length > 0) {
        setActions(
          remoteActions.map((action: any) => ({
            ...action,
            attack_bonus: action.attack_bonus ?? undefined,
            damage: action.damage ?? undefined,
            damage_type: action.damage_type ?? undefined,
            recharge: action.recharge ?? undefined,
            legendary_cost: action.legendary_cost ?? undefined,
            action_type: action.action_type ?? undefined,
            aliases: action.aliases ?? undefined,
            display_name: action.display_name ?? undefined,
          })),
        );
      } else if (staticActions) {
        // Remote not present; fallback to static embedded data.
        setActions(
          staticActions
            .map((a, idx) => mapStaticAction(a as Record<string, unknown>, idx))
            .filter((a) => a.description.trim().length > 0),
        );
      }

      if (remoteTraits.length > 0) {
        setTraits(
          remoteTraits.map((trait: any) => ({
            ...trait,
            display_name: trait.display_name ?? undefined,
            aliases: trait.aliases ?? undefined,
          })),
        );
      } else if (staticTraits) {
        setTraits(
          staticTraits
            .map((t, idx) => mapStaticTrait(t as Record<string, unknown>, idx))
            .filter((t) => t.description.trim().length > 0),
        );
      }
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
  const displayName = formatMonarchVernacular(data.display_name || data.name);
  const monsterSize = formatMonarchVernacular(data.size || 'Medium');
  const monsterType = formatMonarchVernacular(data.creature_type || 'Unknown');
  const armorClass = data.armor_class ?? 0;
  const hitPointsAverage = data.hit_points_average ?? 0;
  const hitPointsFormula = data.hit_points_formula ?? '';
  const cr = data.cr ?? '—';
  const isBoss = Boolean(data.is_boss);

  const queueMonsterActionResolution = (action: MonsterAction, path: string) => {
    const id = crypto.randomUUID();
    const damageRoll = action.damage ? String(action.damage) : null;
    const toHit = typeof action.attack_bonus === 'number' ? action.attack_bonus : null;

    const payload: ActionResolutionPayload = toHit !== null
      ? {
          version: 1,
          id,
          name: `${displayName}: ${formatMonarchVernacular(action.name)}`,
          source: { type: 'monster_action', entryId: data.id },
          kind: 'attack',
          attack: { roll: `1d20+${toHit}` },
          damage: damageRoll ? { roll: damageRoll, type: action.damage_type } : undefined,
        }
      : {
          version: 1,
          id,
          name: `${displayName}: ${formatMonarchVernacular(action.name)}`,
          source: { type: 'monster_action', entryId: data.id },
          kind: 'damage',
          damage: { roll: damageRoll ?? '1d6', type: action.damage_type },
        };

    setPendingResolution(payload);
    navigate(path);
  };

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
        variant={isBoss ? 'alert' : data.tags?.includes('monarch') ? 'arise' : 'default'}
        className={cn(
          isBoss && 'border-gate-a/50 border-2',
          data.tags?.includes('monarch') && 'border-arise-violet/50 border-2',
          gateStyle?.glow
        )}
      >
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted-foreground capitalize font-heading">
              {monsterSize} {monsterType}
              {data.alignment && `, ${formatMonarchVernacular(data.alignment)}`}
            </span>
            {data.gate_rank && gateStyle && (
              <Badge className={cn(gateStyle.bg, gateStyle.text, 'font-display tracking-wider', gateStyle.glow)}>
                {data.gate_rank}-Rank Rift
              </Badge>
            )}
            {isBoss && (
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
                {MONARCH_LABEL}
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
              {formatMonarchVernacular(data.lore)}
            </p>
          )}
        </div>
      </SystemWindow>

      {/* Core Stats */}
      <div className="grid grid-cols-3 md:grid-cols-5 gap-4" id="monster-stats">
        <SystemWindow title="ARMOR CLASS" compact>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-400" />
            <span className="font-display text-2xl">{armorClass}</span>
          </div>
          {data.armor_type && (
          <span className="text-xs text-muted-foreground">{formatMonarchVernacular(data.armor_type)}</span>
          )}
        </SystemWindow>

        <SystemWindow title="HIT POINTS" compact>
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-400" />
            <span className="font-display text-2xl">{hitPointsAverage}</span>
          </div>
          {hitPointsFormula.length > 0 && (
            <span className="text-xs text-muted-foreground">{hitPointsFormula}</span>
          )}
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
            <span className="font-display text-2xl">{cr}</span>
          </div>
          {data.xp && <span className="text-xs text-muted-foreground">{data.xp} XP</span>}
        </SystemWindow>

        <SystemWindow title="RIFT RANK" compact>
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
        copyContent={`${displayName} - Ability Scores: STR ${data.str ?? 10} (${getModifier(data.str ?? 10)}), AGI ${data.agi ?? 10} (${getModifier(data.agi ?? 10)}), VIT ${data.vit ?? 10} (${getModifier(data.vit ?? 10)}), INT ${data.int ?? 10} (${getModifier(data.int ?? 10)}), SENSE ${data.sense ?? 10} (${getModifier(data.sense ?? 10)}), PRE ${data.pre ?? 10} (${getModifier(data.pre ?? 10)})`}
        id="monster-abilities"
      >
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 text-center">
          {[
            { name: 'STR', value: data.str ?? 10 },
            { name: 'AGI', value: data.agi ?? 10 },
            { name: 'VIT', value: data.vit ?? 10 },
            { name: 'INT', value: data.int ?? 10 },
            { name: 'SENSE', value: data.sense ?? 10 },
            { name: 'PRE', value: data.pre ?? 10 },
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
                  <span className="text-muted-foreground">{data.damage_vulnerabilities.map(formatMonarchVernacular).join(', ')}</span>
                </div>
              )}
              {data.damage_resistances && data.damage_resistances.length > 0 && (
                <div>
                  <span className="text-yellow-400 font-heading text-sm">Resistances: </span>
                  <span className="text-muted-foreground">{data.damage_resistances.map(formatMonarchVernacular).join(', ')}</span>
                </div>
              )}
              {data.damage_immunities && data.damage_immunities.length > 0 && (
                <div>
                  <span className="text-black font-heading text-sm">Immunities: </span>
                  <span className="text-muted-foreground">{data.damage_immunities.map(formatMonarchVernacular).join(', ')}</span>
                </div>
              )}
            </div>
          </SystemWindow>
        ) : null}

        {data.condition_immunities && data.condition_immunities.length > 0 && (
          <SystemWindow title="CONDITION IMMUNITIES">
            <div className="flex flex-wrap gap-1">
              {data.condition_immunities.map((condition) => (
                <Badge key={condition} variant="outline">{formatMonarchVernacular(condition)}</Badge>
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
                <h4 className="font-heading font-semibold text-primary mb-1 text-base">{formatMonarchVernacular(trait.name)}</h4>
                <p className="text-sm text-foreground leading-relaxed">{formatMonarchVernacular(trait.description)}</p>
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
                  <h4 className="font-heading font-semibold text-primary text-base">{formatMonarchVernacular(action.name)}</h4>
                  {action.recharge && <Badge variant="secondary" className="text-xs">{action.recharge}</Badge>}
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => queueMonsterActionResolution(action, '/dice')}
                  >
                    Roll
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => queueMonsterActionResolution(action, '/dm-tools/initiative-tracker')}
                  >
                    Resolve in Initiative
                  </Button>
                </div>
                <p className="text-sm text-foreground leading-relaxed mb-1">{formatMonarchVernacular(action.description)}</p>
                {action.damage && (
                  <p className="text-sm text-foreground font-medium mt-2">
                    <span className="font-semibold">Damage:</span> {action.damage} {action.damage_type ? formatMonarchVernacular(action.damage_type) : ''}
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

      {/* Bonus Actions */}
      {bonusActions.length > 0 && (
        <StatBlock title="BONUS ACTIONS" id="monster-bonus-actions">
          <StatSection title="">
            {bonusActions.map((action) => (
              <div key={action.id} className="mb-4 last:mb-0 pb-4 last:pb-0 border-b border-border/30 last:border-b-0">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-heading font-semibold text-primary text-base">{formatMonarchVernacular(action.name)}</h4>
                  {action.recharge && <Badge variant="secondary" className="text-xs">{action.recharge}</Badge>}
                </div>
                <p className="text-sm text-foreground leading-relaxed mb-1">{formatMonarchVernacular(action.description)}</p>
                {action.damage && (
                  <p className="text-sm text-foreground font-medium mt-2">
                    <span className="font-semibold">Damage:</span> {action.damage} {action.damage_type ? formatMonarchVernacular(action.damage_type) : ''}
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

      {/* Reactions */}
      {reactions.length > 0 && (
        <StatBlock title="REACTIONS" id="monster-reactions">
          <StatSection title="">
            {reactions.map((action) => (
              <div key={action.id} className="mb-4 last:mb-0 pb-4 last:pb-0 border-b border-border/30 last:border-b-0">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-heading font-semibold text-primary text-base">{formatMonarchVernacular(action.name)}</h4>
                  {action.recharge && <Badge variant="secondary" className="text-xs">{action.recharge}</Badge>}
                </div>
                <p className="text-sm text-foreground leading-relaxed mb-1">{formatMonarchVernacular(action.description)}</p>
                {action.damage && (
                  <p className="text-sm text-foreground font-medium mt-2">
                    <span className="font-semibold">Damage:</span> {action.damage} {action.damage_type ? formatMonarchVernacular(action.damage_type) : ''}
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
                  <h4 className="font-heading font-semibold text-amber-400 text-base">{formatMonarchVernacular(action.name)}</h4>
                  {action.legendary_cost && action.legendary_cost > 1 && (
                    <Badge variant="outline" className="text-xs">Costs {action.legendary_cost}</Badge>
                  )}
                </div>
                <p className="text-sm text-foreground leading-relaxed">{formatMonarchVernacular(action.description)}</p>
              </div>
            ))}
          </StatSection>
        </StatBlock>
      )}

      {data.description && (
        <StatBlock title="DESCRIPTION" id="monster-description">
          <p className="text-foreground leading-relaxed text-base">{formatMonarchVernacular(data.description)}</p>
        </StatBlock>
      )}
    </div>
  );
};
