/**
 * Player Tools Page
 * Role-based tools for players in System Ascendant
 */

import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Sword, 
  Shield, 
  BookOpen,
  Heart,
  Star,
  Target,
  Zap,
  Users,
  Map,
  Dice6,
  Trophy,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { SystemSigilLogo } from '@/components/ui/SystemSigilLogo';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useActiveCharacter } from '@/hooks/useActiveCharacter';
import { formatMonarchVernacular } from '@/lib/vernacular';

const playerTools = [
  {
    id: 'character-sheet',
    name: 'Character Sheet',
    description: 'Manage your Ascendant stats, abilities, equipment, and progression.',
    icon: User,
    status: 'available',
    color: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 hover:border-blue-500/60',
    iconColor: 'text-blue-400',
    glow: 'group-hover:shadow-blue-500/20',
  },
  {
    id: 'inventory',
    name: 'Inventory',
    description: 'View and manage your items, equipment, and relics.',
    icon: Shield,
    status: 'available',
    color: 'from-green-500/20 to-green-600/10 border-green-500/30 hover:border-green-500/60',
    iconColor: 'text-green-400',
    glow: 'group-hover:shadow-green-500/20',
  },
  {
    id: 'abilities',
    name: 'Abilities & Skills',
    description: 'Track your abilities, skills, and special powers.',
    icon: Zap,
    status: 'available',
    color: 'from-purple-500/20 to-purple-600/10 border-purple-500/30 hover:border-purple-500/60',
    iconColor: 'text-purple-400',
    glow: 'group-hover:shadow-purple-500/20',
  },
  {
    id: 'character-art',
    name: 'Character Art Generator',
    description: 'Generate custom artwork for your Ascendant character.',
    icon: Star,
    status: 'available',
    color: 'from-pink-500/20 to-pink-600/10 border-pink-500/30 hover:border-pink-500/60',
    iconColor: 'text-pink-400',
    glow: 'group-hover:shadow-pink-500/20',
  },
  {
    id: 'compendium-viewer',
    name: 'Compendium Viewer',
    description: 'Browse monsters, items, spells, and world information.',
    icon: BookOpen,
    status: 'available',
    color: 'from-indigo-500/20 to-indigo-600/10 border-indigo-500/30 hover:border-indigo-500/60',
    iconColor: 'text-indigo-400',
    glow: 'group-hover:shadow-indigo-500/20',
  },
  {
    id: 'quest-log',
    name: 'Quest Log',
    description: 'Track active quests, completed missions, and rewards.',
    icon: Target,
    status: 'available',
    color: 'from-orange-500/20 to-orange-600/10 border-orange-500/30 hover:border-orange-500/60',
    iconColor: 'text-orange-400',
    glow: 'group-hover:shadow-orange-500/20',
  },
  {
    id: 'party-view',
    name: 'Party View',
    description: 'View party members, their status, and shared information.',
    icon: Users,
    status: 'campaign-only',
    color: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30 hover:border-cyan-500/60',
    iconColor: 'text-cyan-400',
    glow: 'group-hover:shadow-cyan-500/20',
  },
  {
    id: 'dice-roller',
    name: 'Dice Roller',
    description: 'Roll dice for skill checks, attacks, and saving throws.',
    icon: Dice6,
    status: 'available',
    color: 'from-amber-500/20 to-amber-600/10 border-amber-500/30 hover:border-amber-500/60',
    iconColor: 'text-amber-400',
    glow: 'group-hover:shadow-amber-500/20',
  },
  {
    id: 'achievements',
    name: 'Achievements',
    description: 'View your accomplishments, titles, and special rewards.',
    icon: Trophy,
    status: 'available',
    color: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30 hover:border-yellow-500/60',
    iconColor: 'text-yellow-400',
    glow: 'group-hover:shadow-yellow-500/20',
  },
];

const PlayerTools = () => {
  const { activeCharacter, characters, activeCharacterId, setActiveCharacter, isLoading } = useActiveCharacter();

  const rankInfo = useMemo(() => {
    const level = activeCharacter?.level ?? 0;
    if (level >= 17) return { rank: 'S', color: 'text-amber-400', stars: 5 };
    if (level >= 13) return { rank: 'A', color: 'text-red-400', stars: 4 };
    if (level >= 9) return { rank: 'B', color: 'text-orange-400', stars: 3 };
    if (level >= 5) return { rank: 'C', color: 'text-blue-400', stars: 2 };
    if (level >= 2) return { rank: 'D', color: 'text-green-400', stars: 1 };
    return { rank: 'E', color: 'text-gray-400', stars: 1 };
  }, [activeCharacter]);

  const hpCurrent = activeCharacter?.hp_current ?? 0;
  const hpMax = activeCharacter?.hp_max ?? 0;
  const hpPercent = hpMax > 0 ? Math.min(100, (hpCurrent / hpMax) * 100) : 0;
  const energyCurrent = activeCharacter?.shadow_energy_current ?? 0;
  const energyMax = activeCharacter?.shadow_energy_max ?? 0;
  const energyPercent = energyMax > 0 ? Math.min(100, (energyCurrent / energyMax) * 100) : 0;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <SystemSigilLogo size="md" />
            <div>
              <h1 className="font-arise text-4xl font-bold mb-2 gradient-text-shadow tracking-wider">
                ASCENDANT ARSENAL
              </h1>
              <p className="text-muted-foreground font-heading">
                Your personal tools as an Ascendant in the Umbral Legion. 
                Track your journey, manage your powers, and rise through the ranks.
              </p>
            </div>
          </div>
        </div>

        {/* Player Stats Overview */}
        <SystemWindow title="ASCENDANT STATUS" className="mb-8 border-blue-500/30">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
            <div>
              <h2 className="font-heading text-sm text-muted-foreground">Active Ascendant</h2>
              {activeCharacter ? (
                <div className="text-lg font-semibold">
                  {activeCharacter.name} - Level {activeCharacter.level} {formatMonarchVernacular(activeCharacter.job || 'Unawakened')}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  {isLoading ? 'Loading ascendants...' : 'No ascendants yet'}
                </div>
              )}
            </div>
            {characters.length > 1 && (
              <Select value={activeCharacterId || ''} onValueChange={setActiveCharacter}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select an ascendant" />
                </SelectTrigger>
                <SelectContent>
                  {characters.map((character) => (
                    <SelectItem key={character.id} value={character.id}>
                      {character.name} (Level {character.level})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-br from-blue-500/30 to-blue-600/20 flex items-center justify-center">
                <Heart className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="font-arise text-blue-400 text-lg mb-1">VITALITY</h3>
              <p className="text-2xl font-bold text-white">
                {activeCharacter ? `${hpCurrent}/${hpMax}` : '--'}
              </p>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${hpPercent}%` }}
                />
              </div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-br from-purple-500/30 to-purple-600/20 flex items-center justify-center">
                <Zap className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="font-arise text-purple-400 text-lg mb-1">UMBRAL ENERGY</h3>
              <p className="text-2xl font-bold text-white">
                {activeCharacter ? `${energyCurrent}/${energyMax}` : '--'}
              </p>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                <div
                  className="bg-purple-500 h-2 rounded-full"
                  style={{ width: `${energyPercent}%` }}
                />
              </div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-br from-amber-500/30 to-amber-600/20 flex items-center justify-center">
                <Star className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="font-arise text-amber-400 text-lg mb-1">ASCENDANT RANK</h3>
              <p className="text-2xl font-bold text-white">
                {activeCharacter ? `${rankInfo.rank}-RANK` : '--'}
              </p>
              <div className="flex justify-center gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "w-4 h-4",
                      activeCharacter && star <= rankInfo.stars ? "text-amber-400 fill-current" : "text-gray-600"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </SystemWindow>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {playerTools.map((tool) => {
            const isAvailable = tool.status === 'available';
            const isCampaignOnly = tool.status === 'campaign-only';
            const toolHref = isCampaignOnly ? '/campaigns' : isAvailable ? `/player-tools/${tool.id}` : '#';
            const isInteractive = isAvailable || isCampaignOnly;

            return (
              <Link
                key={tool.id}
                to={toolHref}
                className={cn(
                  "group relative overflow-hidden rounded-xl border p-6 transition-all duration-300",
                  "bg-gradient-to-br backdrop-blur-sm",
                  isInteractive
                    ? cn("hover:scale-[1.02] hover:shadow-xl cursor-pointer", tool.glow)
                    : "opacity-60 cursor-not-allowed",
                  tool.color
                )}
              >
                {/* Hover glow effect */}
                <div className={cn(
                  "absolute -bottom-6 -right-6 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-500",
                  tool.id === 'character-sheet' && "bg-blue-500/30",
                  tool.id === 'inventory' && "bg-green-500/30",
                  tool.id === 'abilities' && "bg-purple-500/30",
                  tool.id === 'character-art' && "bg-pink-500/30",
                  tool.id === 'compendium-viewer' && "bg-indigo-500/30",
                  tool.id === 'quest-log' && "bg-orange-500/30",
                  tool.id === 'party-view' && "bg-cyan-500/30",
                  tool.id === 'dice-roller' && "bg-amber-500/30",
                  tool.id === 'achievements' && "bg-yellow-500/30"
                )} />
                
                {/* Icon */}
                <div className={cn(
                  "w-14 h-14 rounded-xl flex items-center justify-center mb-4 relative z-10",
                  "bg-background/50 border border-current/20",
                  tool.iconColor
                )}>
                  <tool.icon className="w-7 h-7" />
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className={cn(
                    "font-arise text-xl font-semibold mb-2 tracking-wide transition-colors",
                    tool.status === 'available' && "group-hover:text-current",
                    tool.iconColor
                  )}>
                    {tool.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 font-heading">
                    {tool.description}
                  </p>
                </div>

                {/* Status */}
                {tool.status === 'campaign-only' && (
                  <div className={cn("flex items-center text-sm font-heading", tool.iconColor)}>
                    <Users className="w-4 h-4 mr-1" />
                    <span>Campaign Only</span>
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
                {tool.status === 'available' && (
                  <div className={cn("flex items-center text-sm font-heading", tool.iconColor)}>
                    <Sparkles className="w-4 h-4 mr-1" />
                    <span>Open Tool</span>
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        {/* Quick Reference */}
        <div className="mt-12">
          <h2 className="font-arise text-2xl font-bold mb-4 gradient-text-system tracking-wide flex items-center gap-2">
            <Map className="w-5 h-5 text-blue-400" />
            ASCENDANT REFERENCE
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SystemWindow title="RANK PROGRESSION" className="border-blue-500/30">
              <div className="space-y-2 text-sm">
                {[
                  { rank: 'E-Rank', description: 'Beginner Ascendant', color: 'text-gray-400' },
                  { rank: 'D-Rank', description: 'Novice Ascendant', color: 'text-green-400' },
                  { rank: 'C-Rank', description: 'Apprentice Ascendant', color: 'text-blue-400' },
                  { rank: 'B-Rank', description: 'Elite Ascendant', color: 'text-purple-400' },
                  { rank: 'A-Rank', description: 'Master Ascendant', color: 'text-orange-400' },
                  { rank: 'S-Rank', description: 'Legendary Ascendant', color: 'text-red-400' },
                ].map((item) => (
                  <div key={item.rank} className="flex justify-between items-center p-2 rounded bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div>
                      <span className="font-heading">{item.rank}</span>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                    <span className={cn("font-arise text-lg", item.color)}>{item.rank[0]}</span>
                  </div>
                ))}
              </div>
            </SystemWindow>

            <SystemWindow title="SHADOW ABILITIES" variant="alert" className="border-purple-500/30">
              <div className="space-y-2 text-sm">
                {[
                  { ability: 'Shadow Step', type: 'Movement', cost: '10 Energy', color: 'text-purple-400' },
                  { ability: 'Shadow Bolt', type: 'Attack', cost: '15 Energy', color: 'text-red-400' },
                  { ability: 'Shadow Shield', type: 'Defense', cost: '20 Energy', color: 'text-blue-400' },
                  { ability: 'Shadow Sense', type: 'Utility', cost: '5 Energy', color: 'text-green-400' },
                  { ability: 'Shadow Form', type: 'Ultimate', cost: '50 Energy', color: 'text-orange-400' },
                ].map((item) => (
                  <div key={item.ability} className="flex justify-between items-center p-2 rounded bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div>
                      <span className="font-heading">{item.ability}</span>
                      <span className="ml-2 text-xs text-muted-foreground">({item.type})</span>
                    </div>
                    <span className={cn("font-arise text-sm", item.color)}>{item.cost}</span>
                  </div>
                ))}
              </div>
            </SystemWindow>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PlayerTools;



