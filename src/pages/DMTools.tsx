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
  ChevronRight
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const tools = [
  {
    id: 'encounter-builder',
    name: 'Encounter Builder',
    description: 'Create balanced encounters by adding monsters and calculating difficulty.',
    icon: Sword,
    status: 'available',
    color: 'from-red-500/20 to-red-600/10 border-red-500/30',
  },
  {
    id: 'initiative-tracker',
    name: 'Initiative Tracker',
    description: 'Track turn order, HP, conditions, and effects during combat.',
    icon: Clock,
    status: 'available',
    color: 'from-blue-500/20 to-blue-600/10 border-blue-500/30',
  },
  {
    id: 'gate-generator',
    name: 'Gate Generator',
    description: 'Generate random Gates with themes, biomes, bosses, and complications.',
    icon: Flame,
    status: 'coming-soon',
    color: 'from-orange-500/20 to-orange-600/10 border-orange-500/30',
  },
  {
    id: 'npc-generator',
    name: 'NPC Generator',
    description: 'Create NPCs with mannerisms, secrets, and motivations.',
    icon: Users,
    status: 'coming-soon',
    color: 'from-purple-500/20 to-purple-600/10 border-purple-500/30',
  },
  {
    id: 'rollable-tables',
    name: 'Rollable Tables',
    description: 'Access all DMG tables for hazards, complications, rewards, and more.',
    icon: Dice6,
    status: 'coming-soon',
    color: 'from-green-500/20 to-green-600/10 border-green-500/30',
  },
  {
    id: 'relic-workshop',
    name: 'Relic Workshop',
    description: 'Design custom relics balanced within the system guidelines.',
    icon: Settings2,
    status: 'coming-soon',
    color: 'from-amber-500/20 to-amber-600/10 border-amber-500/30',
  },
];

const DMTools = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold mb-2 gradient-text-shadow">
            SHADOW MONARCH'S DOMAIN
          </h1>
          <p className="text-muted-foreground font-heading">
            Tools granted by the Supreme Deity to guide Hunters through the Gates. 
            In this post-reset world, Jinwoo's will shapes reality itself.
          </p>
        </div>

        {/* Default Loop Reminder */}
        <SystemWindow title="THE DEFAULT LOOP" className="mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-display text-primary">1</span>
              <span className="font-heading">Contract</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center font-display text-secondary">2</span>
              <span className="font-heading">Gate</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center font-display text-accent">3</span>
              <span className="font-heading">Aftermath</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            This is the core session structure from the Gate Master's Guide. In the world reset by the Shadow Monarch, 
            Hunters navigate Contracts, Gates, and their Aftermath under the System's watchful gaze.
          </p>
        </SystemWindow>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              to={tool.status === 'available' ? `/dm-tools/${tool.id}` : '#'}
              className={cn(
                "group relative overflow-hidden rounded-xl border p-6 transition-all duration-300",
                "bg-gradient-to-br backdrop-blur-sm",
                tool.status === 'available' 
                  ? "hover:scale-[1.02] hover:shadow-lg cursor-pointer" 
                  : "opacity-60 cursor-not-allowed",
                tool.color
              )}
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-lg bg-background/50 flex items-center justify-center mb-4">
                <tool.icon className="w-6 h-6 text-foreground" />
              </div>

              {/* Content */}
              <h3 className="font-heading text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                {tool.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {tool.description}
              </p>

              {/* Status */}
              {tool.status === 'coming-soon' && (
                <span className="inline-block px-2 py-1 rounded text-xs font-display uppercase bg-muted text-muted-foreground">
                  Coming Soon
                </span>
              )}
              {tool.status === 'available' && (
                <div className="flex items-center text-sm text-primary font-heading">
                  <span>Open Tool</span>
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              )}

              {/* Decorative glow */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>

        {/* Quick Reference */}
        <div className="mt-12">
          <h2 className="font-display text-2xl font-bold mb-4 gradient-text-system">
            QUICK REFERENCE
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SystemWindow title="SYSTEM DIFFICULTY LADDER">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Very Easy</span><span className="font-display">DC 5</span></div>
                <div className="flex justify-between"><span>Easy</span><span className="font-display">DC 10</span></div>
                <div className="flex justify-between"><span>Moderate</span><span className="font-display">DC 15</span></div>
                <div className="flex justify-between"><span>Hard</span><span className="font-display">DC 20</span></div>
                <div className="flex justify-between"><span>Very Hard</span><span className="font-display">DC 25</span></div>
                <div className="flex justify-between"><span>Nearly Impossible</span><span className="font-display">DC 30</span></div>
              </div>
            </SystemWindow>

            <SystemWindow title="TIER CAPS" variant="alert">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Tier 1 (1-4)</span><span className="font-display">+6 / DC 14</span></div>
                <div className="flex justify-between"><span>Tier 2 (5-10)</span><span className="font-display">+10 / DC 18</span></div>
                <div className="flex justify-between"><span>Tier 3 (11-16)</span><span className="font-display">+12 / DC 20</span></div>
                <div className="flex justify-between"><span>Tier 4 (17-20)</span><span className="font-display">+14 / DC 22</span></div>
              </div>
            </SystemWindow>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DMTools;
