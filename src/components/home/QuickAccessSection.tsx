import { Link } from 'react-router-dom';
import { 
  Swords, 
  Wand2, 
  Gem, 
  Skull, 
  ScrollText,
  Flame,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const compendiumCategories = [
  {
    name: 'Jobs',
    description: 'Hunter classes and progression paths',
    icon: Swords,
    href: '/compendium/jobs',
    color: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 hover:border-blue-400/50',
    count: 12,
  },
  {
    name: 'Powers',
    description: 'Techniques, spells, and abilities',
    icon: Wand2,
    href: '/compendium/powers',
    color: 'from-purple-500/20 to-purple-600/10 border-purple-500/30 hover:border-purple-400/50',
    count: 150,
  },
  {
    name: 'Relics',
    description: 'Magical items and equipment',
    icon: Gem,
    href: '/compendium/relics',
    color: 'from-amber-500/20 to-amber-600/10 border-amber-500/30 hover:border-amber-400/50',
    count: 500,
  },
  {
    name: 'Monsters',
    description: 'Gate creatures and bosses',
    icon: Skull,
    href: '/compendium/monsters',
    color: 'from-red-500/20 to-red-600/10 border-red-500/30 hover:border-red-400/50',
    count: 200,
  },
  {
    name: 'Rules',
    description: 'Core mechanics and procedures',
    icon: ScrollText,
    href: '/compendium/rules',
    color: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 hover:border-emerald-400/50',
    count: 25,
  },
  {
    name: 'Gates',
    description: 'Gate types and generation',
    icon: Flame,
    href: '/compendium/gates',
    color: 'from-orange-500/20 to-orange-600/10 border-orange-500/30 hover:border-orange-400/50',
    count: 50,
  },
];

export function QuickAccessSection() {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            <span className="gradient-text-shadow">COMPENDIUM</span>
          </h2>
          <p className="text-muted-foreground font-heading max-w-xl mx-auto">
            Knowledge preserved by the System in this post-reset world. All content is searchable, 
            cross-linked, and blessed by the Shadow Monarch's domain.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {compendiumCategories.map((category) => (
            <Link
              key={category.name}
              to={category.href}
              className={cn(
                "group relative overflow-hidden rounded-xl border p-6 transition-all duration-300",
                "bg-gradient-to-br backdrop-blur-sm",
                "hover:scale-[1.02] hover:shadow-lg",
                category.color
              )}
            >
              {/* Icon */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-background/50 flex items-center justify-center">
                  <category.icon className="w-6 h-6 text-foreground" />
                </div>
                <span className="text-xs font-display text-muted-foreground bg-background/50 px-2 py-1 rounded">
                  {category.count} entries
                </span>
              </div>

              {/* Content */}
              <h3 className="font-heading text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                {category.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {category.description}
              </p>

              {/* Arrow */}
              <div className="flex items-center text-sm text-primary font-heading">
                <span>Browse</span>
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>

              {/* Decorative glow */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
