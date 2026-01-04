import { Link } from 'react-router-dom';
import { 
  Map, 
  Sword, 
  Clock, 
  Flame, 
  Users, 
  BookOpen,
  Dice6,
  Settings2,
  ChevronRight,
  Crown,
  Sparkles,
  Zap,
  Gem,
  Target,
  Calendar,
  AlertTriangle,
  UsersRound,
  Grid,
  Image as ImageIcon,
  Layers,
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { ShadowMonarchLogo } from '@/components/ui/ShadowMonarchLogo';
import { GatePortal } from '@/components/ui/GatePortal';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const tools = [
  {
    id: 'encounter-builder',
    name: 'Encounter Builder',
    description: 'Create balanced encounters by adding monsters and calculating difficulty.',
    icon: Sword,
    status: 'available',
    color: 'from-red-500/20 to-red-600/10 border-red-500/30 hover:border-red-500/60',
    iconColor: 'text-red-400',
    glow: 'group-hover:shadow-red-500/20',
  },
  {
    id: 'initiative-tracker',
    name: 'Initiative Tracker',
    description: 'Track turn order, HP, conditions, and effects during combat.',
    icon: Clock,
    status: 'available',
    color: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 hover:border-blue-500/60',
    iconColor: 'text-blue-400',
    glow: 'group-hover:shadow-blue-500/20',
  },
  {
    id: 'gate-generator',
    name: 'Gate Generator',
    description: 'Generate random Gates with themes, biomes, bosses, and complications.',
    icon: Flame,
    status: 'available',
    color: 'from-orange-500/20 to-orange-600/10 border-orange-500/30 hover:border-orange-500/60',
    iconColor: 'text-orange-400',
    glow: 'group-hover:shadow-orange-500/20',
  },
  {
    id: 'npc-generator',
    name: 'NPC Generator',
    description: 'Create NPCs with mannerisms, secrets, and motivations.',
    icon: Users,
    status: 'available',
    color: 'from-arise/20 to-shadow-purple/10 border-arise/30 hover:border-arise/60',
    iconColor: 'text-arise',
    glow: 'group-hover:shadow-arise/20',
  },
  {
    id: 'rollable-tables',
    name: 'Rollable Tables',
    description: 'Access all Gate Master\'s Guide tables for hazards, complications, rewards, and more.',
    icon: Dice6,
    status: 'available',
    color: 'from-green-500/20 to-green-600/10 border-green-500/30 hover:border-green-500/60',
    iconColor: 'text-green-400',
    glow: 'group-hover:shadow-green-500/20',
  },
  {
    id: 'relic-workshop',
    name: 'Relic Workshop',
    description: 'Design custom relics balanced within the system guidelines.',
    icon: Settings2,
    status: 'available',
    color: 'from-amber-500/20 to-amber-600/10 border-amber-500/30 hover:border-amber-500/60',
    iconColor: 'text-amber-400',
    glow: 'group-hover:shadow-amber-500/20',
  },
  {
    id: 'treasure-generator',
    name: 'Treasure Generator',
    description: 'Generate treasure hoards by Gate Rank with gold, items, materials, and relics.',
    icon: Gem,
    status: 'available',
    color: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30 hover:border-yellow-500/60',
    iconColor: 'text-yellow-400',
    glow: 'group-hover:shadow-yellow-500/20',
  },
  {
    id: 'quest-generator',
    name: 'Quest Generator',
    description: 'Generate missions and contracts with objectives, complications, and rewards.',
    icon: Target,
    status: 'available',
    color: 'from-indigo-500/20 to-indigo-600/10 border-indigo-500/30 hover:border-indigo-500/60',
    iconColor: 'text-indigo-400',
    glow: 'group-hover:shadow-indigo-500/20',
  },
  {
    id: 'session-planner',
    name: 'Session Planner',
    description: 'Plan and organize sessions with notes, encounters, NPCs, and plot points.',
    icon: Calendar,
    status: 'available',
    color: 'from-pink-500/20 to-pink-600/10 border-pink-500/30 hover:border-pink-500/60',
    iconColor: 'text-pink-400',
    glow: 'group-hover:shadow-pink-500/20',
  },
  {
    id: 'random-event-generator',
    name: 'Random Event Generator',
    description: 'Generate random world events, NPC encounters, and complications.',
    icon: AlertTriangle,
    status: 'available',
    color: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30 hover:border-cyan-500/60',
    iconColor: 'text-cyan-400',
    glow: 'group-hover:shadow-cyan-500/20',
  },
  {
    id: 'party-tracker',
    name: 'Party Tracker',
    description: 'Track party members\' HP, conditions, AC, and status during sessions.',
    icon: UsersRound,
    status: 'available',
    color: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 hover:border-emerald-500/60',
    iconColor: 'text-emerald-400',
    glow: 'group-hover:shadow-emerald-500/20',
  },
  {
    id: 'dungeon-map-generator',
    name: 'Dungeon Map Generator',
    description: 'Generate full Gate/dungeon maps with rooms, corridors, and special chambers for VTT-style gameplay.',
    icon: Grid,
    status: 'available',
    color: 'from-violet-500/20 to-violet-600/10 border-violet-500/30 hover:border-violet-500/60',
    iconColor: 'text-violet-400',
    glow: 'group-hover:shadow-violet-500/20',
  },
  {
    id: 'token-library',
    name: 'Token Library',
    description: 'Manage tokens and assets for VTT sessions. Create custom tokens, organize by category.',
    icon: ImageIcon,
    status: 'available',
    color: 'from-teal-500/20 to-teal-600/10 border-teal-500/30 hover:border-teal-500/60',
    iconColor: 'text-teal-400',
    glow: 'group-hover:shadow-teal-500/20',
  },
  {
    id: 'vtt-map',
    name: 'VTT Map Viewer',
    description: 'Place tokens on maps for virtual tabletop gameplay. Drag tokens, rotate, and organize by layers.',
    icon: Layers,
    status: 'available',
    color: 'from-rose-500/20 to-rose-600/10 border-rose-500/30 hover:border-rose-500/60',
    iconColor: 'text-rose-400',
    glow: 'group-hover:shadow-rose-500/20',
  },
  {
    id: 'vtt-enhanced',
    name: 'Enhanced VTT',
    description: 'Full-featured virtual tabletop with scenes, fog of war, initiative tracking, dice, and chat.',
    icon: Layers,
    status: 'campaign-only',
    color: 'from-purple-500/20 to-purple-600/10 border-purple-500/30 hover:border-purple-500/60',
    iconColor: 'text-purple-400',
    glow: 'group-hover:shadow-purple-500/20',
  },
  {
    id: 'vtt-journal',
    name: 'VTT Journal',
    description: 'Campaign journal entries, session logs, lore, and handouts for your virtual tabletop sessions.',
    icon: BookOpen,
    status: 'campaign-only',
    color: 'from-indigo-500/20 to-indigo-600/10 border-indigo-500/30 hover:border-indigo-500/60',
    iconColor: 'text-indigo-400',
    glow: 'group-hover:shadow-indigo-500/20',
  },
];

const DMTools = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <ShadowMonarchLogo size="md" />
            <div>
              <h1 className="font-arise text-4xl font-bold mb-2 gradient-text-shadow tracking-wider">
                SUPREME DEITY'S DOMAIN
              </h1>
              <p className="text-muted-foreground font-heading">
                Divine tools granted to guide Hunters through the Gates. 
                In this post-reset world, the System's will shapes reality.
              </p>
            </div>
          </div>
        </div>

        {/* Default Loop Reminder */}
        <SystemWindow title="THE ETERNAL LOOP" className="mb-8 border-arise/30">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 justify-center">
            <div className="flex items-center gap-3 group">
              <span className="w-12 h-12 rounded-full bg-gradient-to-br from-arise/30 to-shadow-purple/20 flex items-center justify-center font-arise text-arise border border-arise/30 group-hover:shadow-arise/30 group-hover:shadow-lg transition-all">
                1
              </span>
              <div>
                <span className="font-arise text-arise tracking-wide">CONTRACT</span>
                <p className="text-xs text-muted-foreground">Accept the mission</p>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-arise/50 hidden sm:block" />
            <div className="flex items-center gap-3 group">
              <span className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500/30 to-red-500/20 flex items-center justify-center font-arise text-orange-400 border border-orange-500/30 group-hover:shadow-orange-500/30 group-hover:shadow-lg transition-all">
                2
              </span>
              <div>
                <span className="font-arise text-orange-400 tracking-wide">GATE</span>
                <p className="text-xs text-muted-foreground">Enter the dungeon</p>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-arise/50 hidden sm:block" />
            <div className="flex items-center gap-3 group">
              <span className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500/30 to-yellow-500/20 flex items-center justify-center font-arise text-amber-400 border border-amber-500/30 group-hover:shadow-amber-500/30 group-hover:shadow-lg transition-all">
                3
              </span>
              <div>
                <span className="font-arise text-amber-400 tracking-wide">AFTERMATH</span>
                <p className="text-xs text-muted-foreground">Claim rewards</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-6 text-center">
            The core session structure from the Gate Master's Guide. Hunters navigate Contracts, Gates, and their Aftermath under the System's watchful gaze.
          </p>
        </SystemWindow>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              to={tool.status === 'available' ? `/dm-tools/${tool.id}` : '#'}
              className={cn(
                "group relative overflow-hidden rounded-xl border p-6 transition-all duration-300",
                "bg-gradient-to-br backdrop-blur-sm",
                tool.status === 'available' 
                  ? cn("hover:scale-[1.02] hover:shadow-xl cursor-pointer", tool.glow)
                  : "opacity-60 cursor-not-allowed",
                tool.color
              )}
            >
              {/* Background decorations */}
              {tool.id === 'gate-generator' && (
                <div className="absolute top-0 right-0 opacity-10 group-hover:opacity-20 transition-opacity">
                  <GatePortal rank="A" className="w-32 h-32" animated={false} />
                </div>
              )}
              {tool.id === 'encounter-builder' && (
                <div className="absolute top-0 right-0 opacity-10 group-hover:opacity-20 transition-opacity">
                  <ShadowMonarchLogo size="md" />
                </div>
              )}
              
              {/* Hover glow effect */}
              <div className={cn(
                "absolute -bottom-6 -right-6 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-500",
                tool.id === 'encounter-builder' && "bg-red-500/30",
                tool.id === 'initiative-tracker' && "bg-blue-500/30",
                tool.id === 'gate-generator' && "bg-orange-500/30",
                tool.id === 'npc-generator' && "bg-arise/30",
                tool.id === 'rollable-tables' && "bg-green-500/30",
                tool.id === 'relic-workshop' && "bg-amber-500/30",
                tool.id === 'treasure-generator' && "bg-yellow-500/30",
                tool.id === 'quest-generator' && "bg-indigo-500/30",
                tool.id === 'session-planner' && "bg-pink-500/30",
                tool.id === 'random-event-generator' && "bg-cyan-500/30",
                tool.id === 'party-tracker' && "bg-emerald-500/30",
                tool.id === 'dungeon-map-generator' && "bg-violet-500/30",
                tool.id === 'token-library' && "bg-teal-500/30",
                tool.id === 'vtt-map' && "bg-rose-500/30"
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
              {tool.status === 'coming-soon' && (
                <span className={cn(
                  "inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-arise uppercase",
                  "bg-muted/50 text-muted-foreground border border-muted-foreground/20"
                )}>
                  <Sparkles className="w-3 h-3" />
                  Coming Soon
                </span>
              )}
              {tool.status === 'campaign-only' && (
                <div className={cn("flex items-center text-sm font-heading", tool.iconColor)}>
                  <Crown className="w-4 h-4 mr-1" />
                  <span>Requires Campaign</span>
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
              {tool.status === 'available' && (
                <div className={cn("flex items-center text-sm font-heading", tool.iconColor)}>
                  <Zap className="w-4 h-4 mr-1" />
                  <span>Open Tool</span>
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </Link>
          ))}
        </div>

        {/* Quick Reference */}
        <div className="mt-12">
          <h2 className="font-arise text-2xl font-bold mb-4 gradient-text-system tracking-wide flex items-center gap-2">
            <Crown className="w-5 h-5 text-arise" />
            SYSTEM REFERENCE
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SystemWindow title="DIFFICULTY LADDER" className="border-arise/30">
              <div className="space-y-2 text-sm">
                {[
                  { name: 'Very Easy', dc: 5, color: 'text-green-400' },
                  { name: 'Easy', dc: 10, color: 'text-blue-400' },
                  { name: 'Moderate', dc: 15, color: 'text-yellow-400' },
                  { name: 'Hard', dc: 20, color: 'text-orange-400' },
                  { name: 'Very Hard', dc: 25, color: 'text-red-400' },
                  { name: 'Nearly Impossible', dc: 30, color: 'text-purple-400' },
                ].map((item) => (
                  <div key={item.dc} className="flex justify-between items-center p-2 rounded bg-muted/30 hover:bg-muted/50 transition-colors">
                    <span className="font-heading">{item.name}</span>
                    <span className={cn("font-arise text-lg", item.color)}>DC {item.dc}</span>
                  </div>
                ))}
              </div>
            </SystemWindow>

            <SystemWindow title="HUNTER TIERS" variant="alert" className="border-amber-500/30">
              <div className="space-y-2 text-sm">
                {[
                  { tier: 'Tier 1 (1-4)', bonus: '+6', dc: '14', rank: 'D-C', color: 'text-green-400' },
                  { tier: 'Tier 2 (5-10)', bonus: '+10', dc: '18', rank: 'C-B', color: 'text-blue-400' },
                  { tier: 'Tier 3 (11-16)', bonus: '+12', dc: '20', rank: 'B-A', color: 'text-orange-400' },
                  { tier: 'Tier 4 (17-20)', bonus: '+14', dc: '22', rank: 'A-S', color: 'text-amber-400' },
                ].map((item) => (
                  <div key={item.tier} className="flex justify-between items-center p-2 rounded bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div>
                      <span className="font-heading">{item.tier}</span>
                      <span className={cn("ml-2 text-xs", item.color)}>[{item.rank}]</span>
                    </div>
                    <span className="font-arise text-lg">
                      <span className="text-arise">{item.bonus}</span>
                      <span className="text-muted-foreground mx-1">/</span>
                      <span className="text-amber-400">DC {item.dc}</span>
                    </span>
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

export default DMTools;
