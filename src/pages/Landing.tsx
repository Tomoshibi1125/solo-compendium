import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const uiShowcase = [
  {
    title: 'Access Terminal',
    description: 'Secure entry to the System.',
    src: '/generated/ui/login-page-bg.jpg',
  },
  {
    title: 'System Interface',
    description: 'Live telemetry and overlays.',
    src: '/generated/ui-art/system-interface.jpg',
  },
  {
    title: 'Gate Portal',
    description: 'Rifts mapped and ranked.',
    src: '/generated/ui-art/gate-portal-3d.jpg',
  },
  {
    title: 'Shadow Silhouette',
    description: 'Hunter presence in the realm.',
    src: '/generated/ui-art/shadow-silhouette.jpg',
  },
];

const compendiumGallery = [
  {
    title: 'Monsters',
    items: [
      { name: 'Shadow Demon', src: '/generated/compendium/monsters/shadow-demon.jpg' },
      { name: 'Shadow Beast', src: '/generated/compendium/monsters/shadow-beast.jpg' },
      { name: 'Shadow Lord', src: '/generated/compendium/monsters/shadow-lord.jpg' },
    ],
  },
  {
    title: 'Items',
    items: [
      { name: 'Shadow Blade', src: '/generated/compendium/items/shadow-blade.jpg' },
      { name: 'Shadow Armor', src: '/generated/compendium/items/shadow-armor.jpg' },
      { name: 'Shadow Ring', src: '/generated/compendium/items/shadow-ring.jpg' },
    ],
  },
  {
    title: 'Spells',
    items: [
      { name: 'Shadow Bolt', src: '/generated/compendium/spells/shadow-bolt.jpg' },
      { name: 'Shadow Shield', src: '/generated/compendium/spells/shadow-shield.jpg' },
      { name: 'Shadow Teleport', src: '/generated/compendium/spells/shadow-teleport.jpg' },
    ],
  },
  {
    title: 'Locations',
    items: [
      { name: 'Shadow Dungeon', src: '/generated/compendium/locations/shadow-dungeon.jpg' },
      { name: 'Shadow Castle', src: '/generated/compendium/locations/shadow-castle.jpg' },
      { name: 'Shadow Gate', src: '/generated/compendium/locations/shadow-gate.jpg' },
    ],
  },
  {
    title: 'Jobs',
    items: [
      { name: 'Shadow Warrior', src: '/generated/compendium/jobs/shadow-warrior.jpg' },
      { name: 'Shadow Mage', src: '/generated/compendium/jobs/shadow-mage.jpg' },
      { name: 'Shadow Assassin', src: '/generated/compendium/jobs/shadow-assassin.jpg' },
    ],
  },
  {
    title: 'Backgrounds',
    items: [
      { name: 'Shadow Realm', src: '/generated/compendium/backgrounds/shadow-realm.jpg' },
      { name: 'Shadow City', src: '/generated/compendium/backgrounds/shadow-city.jpg' },
      { name: 'Shadow Forest', src: '/generated/compendium/backgrounds/shadow-forest.jpg' },
    ],
  },
];

const Landing = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-cover bg-center opacity-30 landing-hero-bg" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/70 to-black" />
        <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-purple-600/20 blur-[140px]" />
      </div>

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <img
            src="/generated/ui-art/shadow-soldier-emblem.jpg"
            alt="Shadow Soldier Emblem"
            className="h-10 w-10 rounded-full border border-purple-500/60 shadow-lg shadow-purple-500/40"
          />
          <div className="leading-tight">
            <p className="text-xs uppercase tracking-[0.2em] text-purple-200/70">Solo Compendium</p>
            <p className="font-arise text-lg tracking-widest">The System</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="outline" className="border-purple-500/60 text-purple-100 hover:border-purple-400">
              Login
            </Button>
          </Link>
          <Link to="/characters">
            <Button variant="outline" className="border-purple-500/60 text-purple-100 hover:border-purple-400">
              Hunters
            </Button>
          </Link>
          <Link to="/compendium">
            <Button className="btn-shadow-monarch">Compendium</Button>
          </Link>
        </div>
      </header>

      <main className="relative z-10">
        <section className="mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-16 pt-10 lg:flex-row lg:items-center">
          <div className="flex-1">
            <p className="mb-4 text-sm font-display uppercase tracking-[0.3em] text-purple-200/70">
              System status: online
            </p>
            <h1 className="font-arise text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              Enter the shadows and command the full compendium.
            </h1>
            <p className="mt-4 text-lg text-gray-300">
              Manage hunters, explore gates, and keep every rule, relic, and monster within reach.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link to="/login">
                <Button size="lg" className="btn-shadow-monarch shadow-monarch-glow">
                  Enter Login
                </Button>
              </Link>
              <Link to="/compendium">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-purple-500/60 text-purple-100 hover:border-purple-400"
                >
                  Explore Compendium
                </Button>
              </Link>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { label: 'UI Art', value: '6 assets' },
                { label: 'Compendium Art', value: '18 entries' },
                { label: 'System Tools', value: 'Full access' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl border border-white/10 bg-black/40 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-purple-200/70">{stat.label}</p>
                  <p className="mt-2 text-xl font-display">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40">
              <img
                src="/generated/ui-art/gate-portal-3d.jpg"
                alt="Gate portal"
                className="h-72 w-full object-cover sm:h-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4">
                <p className="text-xs uppercase tracking-[0.2em] text-purple-200/70">Gate Rank</p>
                <p className="text-xl font-heading">S-Class Breach</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-arise text-2xl font-bold tracking-wide">System visuals</h2>
              <p className="mt-2 text-sm text-gray-400">
                Every screen is powered by Solo Leveling inspired art and atmosphere.
              </p>
            </div>
            <Link to="/login" className="inline-flex items-center gap-2 text-sm text-purple-200 hover:text-white">
              Request access <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {uiShowcase.map((item) => (
              <div key={item.title} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                <img src={item.src} alt={item.title} className="h-40 w-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-sm font-heading">{item.title}</p>
                  <p className="text-xs text-gray-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-arise text-2xl font-bold tracking-wide">Compendium gallery</h2>
              <p className="mt-2 text-sm text-gray-400">
                Full compendium art is organized by category for quick reference.
              </p>
            </div>
            <Link to="/compendium">
              <Button variant="outline" className="border-purple-500/60 text-purple-100 hover:border-purple-400">
                Open compendium
              </Button>
            </Link>
          </div>
          <div className="mt-8 space-y-8">
            {compendiumGallery.map((section) => (
              <div key={section.title}>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-heading text-lg tracking-wide">{section.title}</h3>
                  <span className="text-xs text-gray-400">{section.items.length} entries</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {section.items.map((item) => (
                    <div
                      key={item.name}
                      className="relative overflow-hidden rounded-xl border border-white/10 bg-black/50"
                    >
                      <img src={item.src} alt={item.name} className="h-32 w-full object-cover" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute bottom-2 left-2 text-xs font-heading text-white">
                        {item.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-16">
          <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-r from-purple-900/40 to-blue-900/30 p-8">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div>
                <h2 className="font-arise text-2xl font-bold">Ready to enter the System?</h2>
                <p className="mt-2 text-sm text-gray-300">
                  Login first, then explore the full compendium with admin authorization.
                </p>
              </div>
              <Link to="/login">
                <Button size="lg" className="btn-shadow-monarch shadow-monarch-glow">
                  Enter Login
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Landing;
