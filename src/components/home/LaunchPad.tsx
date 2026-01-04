import { Link } from 'react-router-dom';
import { useState } from 'react';
import { 
  Users, 
  BookOpen, 
  Sword, 
  ArrowRight, 
  Crown,
  UserPlus,
  Dice1,
  Settings,
  Sparkles,
  Zap,
  Skull,
  UsersRound,
  Map
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { ShadowMonarchLogo } from '@/components/ui/ShadowMonarchLogo';
import { GatePortal } from '@/components/ui/GatePortal';
import { HunterBadge } from '@/components/ui/HunterBadge';
import { CompendiumQuickStats } from '@/components/compendium/CompendiumQuickStats';
import { useCharacters } from '@/hooks/useCharacters';
import { useMyCampaigns, useJoinedCampaigns, useIsDM } from '@/hooks/useCampaigns';
import { RoleBadge } from '@/components/ui/RoleBadge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

type ViewMode = 'dm' | 'player';

export function LaunchPad() {
  const { data: characters, isLoading: charactersLoading, error: charactersError } = useCharacters();
  const { data: myCampaigns, isLoading: myCampaignsLoading, error: myCampaignsError } = useMyCampaigns();
  const { data: joinedCampaigns, isLoading: joinedCampaignsLoading, error: joinedCampaignsError } = useJoinedCampaigns();
  const { data: isDM = false } = useIsDM();
  
  // DM/Player mode selector - default to DM mode if user is a DM
  const [viewMode, setViewMode] = useState<ViewMode>(isDM ? 'dm' : 'player');

  const recentCharacters = characters?.slice(0, 3) || [];
  const recentMyCampaigns = myCampaigns?.slice(0, 2) || [];
  const recentJoinedCampaigns = joinedCampaigns?.slice(0, 2) || [];

  // Check if any queries have errors
  const hasError = !!charactersError || !!myCampaignsError || !!joinedCampaignsError;
  
  // Check if all data is loaded (not loading)
  const allLoaded = !charactersLoading && !myCampaignsLoading && !joinedCampaignsLoading;
  
  // Check if user has any data (authenticated)
  const hasData = (characters?.length ?? 0) > 0 || (myCampaigns?.length ?? 0) > 0 || (joinedCampaigns?.length ?? 0) > 0;
  
  // Check if all data is loaded and empty (unauthenticated user)
  const isUnauthenticated = allLoaded && !hasData && !hasError;

  // Show loading state while queries are loading
  if (!allLoaded && !hasError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (isUnauthenticated) {
    return <UnauthenticatedWelcomeScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/5">
      {/* Supreme Deity's Domain - Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] bg-gradient-radial from-shadow-blue/8 via-shadow-purple/4 to-transparent rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-[150px] h-[150px] sm:w-[250px] sm:h-[250px] md:w-[350px] md:h-[350px] lg:w-[400px] lg:h-[400px] bg-gradient-radial from-arise-violet/6 via-shadow-purple/3 to-transparent rounded-full blur-3xl animate-pulse-glow-delay-1s" />
        
        {/* Subtle grid overlay - System interface */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `linear-gradient(hsl(var(--shadow-blue)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--shadow-blue)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10 max-w-full overflow-x-hidden">
        {/* Header - The System's Domain */}
        <div className="text-center mb-12 animate-slide-up">
          <div className="inline-block mb-6">
            <SystemWindow variant="arise" className="px-6 py-2" animated>
              <div className="flex items-center gap-2 font-heading">
                <Skull className="w-4 h-4 text-arise-violet" />
                <span className="text-sm gradient-text-arise font-semibold tracking-wide">The System's Domain</span>
                <Sparkles className="w-4 h-4 text-shadow-purple" />
              </div>
            </SystemWindow>
          </div>
          
          {/* Supreme Deity Logo - Supreme variant */}
          <div className="flex justify-center mb-6">
            <ShadowMonarchLogo size="lg" variant="supreme" className="drop-shadow-2xl" />
          </div>
          
          <h1 className="font-arise text-4xl sm:text-5xl lg:text-6xl font-black mb-4">
            <span className="gradient-text-arise text-glow-arise">LAUNCH PAD</span>
          </h1>
          {/* Role Badge */}
          <div className="flex justify-center mb-4">
            {isDM ? (
              <RoleBadge role="system" />
            ) : (
              <RoleBadge role="hunter" />
            )}
          </div>
          <p className="text-muted-foreground font-heading max-w-2xl mx-auto leading-relaxed mb-6">
            {isDM ? (
              <>
                <span className="text-primary font-semibold">Gate Master (System)</span> — You have access to System Tools to manage your campaigns. Manage your <span className="text-primary">Hunters</span>, create <span className="text-shadow-purple">Campaigns</span>, and explore the <span className="text-accent">Compendium</span>.
              </>
            ) : (
              <>
                Your gateway to the System. Manage your <span className="text-primary">Hunters</span>, join <span className="text-shadow-purple">Campaigns</span>, and explore the <span className="text-accent">Compendium</span>.
              </>
            )}
          </p>

          {/* Mode Selector - Only show for DMs */}
          {isDM && (
            <div className="flex justify-center mb-6">
              <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)} className="w-auto">
                <TabsList className="glass-card border border-primary/20 bg-background/50">
                  <TabsTrigger 
                    value="dm" 
                    className={cn(
                      "data-[state=active]:bg-primary/20 data-[state=active]:text-primary",
                      "px-6 py-2"
                    )}
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Gate Master Mode
                  </TabsTrigger>
                  <TabsTrigger 
                    value="player"
                    className={cn(
                      "data-[state=active]:bg-primary/20 data-[state=active]:text-primary",
                      "px-6 py-2"
                    )}
                  >
                    <Sword className="w-4 h-4 mr-2" />
                    Hunter Mode
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          )}
        </div>

        {/* Quick Actions - The System's Commands */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {viewMode === 'dm' && isDM ? (
            <>
              {/* DM Mode Actions */}
              <QuickActionCard
                icon={Map}
                title="System Tools"
                description="Gate Master tools for campaigns"
                href="/dm-tools"
                variant="primary"
                graphic={<Crown className="w-16 h-16 opacity-60 text-primary" />}
              />
              <QuickActionCard
                icon={Crown}
                title="My Campaigns"
                description="Manage your campaigns"
                href="/campaigns"
                variant="primary"
              />
              <QuickActionCard
                icon={Users}
                title="Campaign Management"
                description="Create or join campaigns"
                href="/campaigns"
                variant="default"
              />
              <QuickActionCard
                icon={BookOpen}
                title="Compendium"
                description="Browse knowledge"
                href="/compendium"
                variant="default"
                graphic={<GatePortal rank="S" className="w-16 h-16 opacity-60" />}
              />
            </>
          ) : (
            <>
              {/* Player Mode Actions */}
              <QuickActionCard
                icon={Zap}
                title="Awaken Hunter"
                description="Awaken a new Hunter"
                href="/characters/new"
                variant="primary"
              />
              <QuickActionCard
                icon={BookOpen}
                title="Compendium"
                description="Browse knowledge"
                href="/compendium"
                variant="default"
                graphic={<GatePortal rank="S" className="w-16 h-16 opacity-60" />}
              />
              <QuickActionCard
                icon={Crown}
                title="Create Campaign"
                description="Start a new campaign"
                href="/campaigns"
                variant="default"
              />
              <QuickActionCard
                icon={UserPlus}
                title="Join Campaign"
                description="Enter with share code"
                href="/campaigns/join"
                variant="default"
              />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Hunters - Shadow Army - Only show in Player Mode or if not DM */}
          {(viewMode === 'player' || !isDM) && (
            <div className="lg:col-span-2">
              <SystemWindow title="SHADOW ARMY — HUNTERS" variant="monarch" className="h-full">
              {charactersLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : recentCharacters.length > 0 ? (
                <div className="space-y-3">
                  {recentCharacters.map((character, index) => (
                    <Link
                      key={character.id}
                      to={`/characters/${character.id}`}
                      className={cn(
                        "block p-4 rounded-lg border border-border bg-background/50 hover:bg-muted/50 hover:border-shadow-purple/40 transition-all group card-shadow-energy",
                        index === 0 && "animate-arise"
                      )}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <HunterBadge rank="B" size="sm" />
                            <div>
                              <h3 className="font-heading font-semibold group-hover:text-primary transition-colors">
                                {character.name}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {character.job || 'Unknown Job'} • Level {character.level}
                              </p>
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </Link>
                  ))}
                  <Link
                    to="/characters"
                    className="block mt-4 text-center text-sm text-primary font-heading hover:underline hover:text-shadow-purple transition-colors"
                  >
                    View all Hunters →
                  </Link>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="flex justify-center mb-4">
                    <HunterBadge rank="E" size="md" className="opacity-50" />
                  </div>
                  <p className="text-muted-foreground font-heading mb-4">
                    No Hunters awakened yet. Create your first one!
                  </p>
                  <Link to="/characters/new">
                    <Button size="sm" className="btn-shadow-monarch">
                      <Zap className="w-4 h-4 mr-2" />
                      Awaken Hunter
                    </Button>
                  </Link>
                </div>
              )}
            </SystemWindow>
            </div>
          )}

          {/* DM Campaign View - Show when in DM Mode */}
          {viewMode === 'dm' && isDM && (
            <div className="lg:col-span-2">
              <SystemWindow title="GATE MASTER'S CAMPAIGNS" variant="monarch" className="h-full">
                {myCampaignsLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                ) : recentMyCampaigns.length > 0 ? (
                  <div className="space-y-3">
                    {recentMyCampaigns.map((campaign, index) => (
                      <Link
                        key={campaign.id}
                        to={`/campaigns/${campaign.id}`}
                        className={cn(
                          "block p-4 rounded-lg border border-border bg-background/50 hover:bg-muted/50 hover:border-primary/40 transition-all group card-shadow-energy",
                          index === 0 && "animate-arise"
                        )}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Crown className="w-5 h-5 text-primary" />
                              <div>
                                <h3 className="font-heading font-semibold group-hover:text-primary transition-colors">
                                  {campaign.name}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {campaign.description || 'No description'}
                                </p>
                              </div>
                            </div>
                          </div>
                          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </div>
                      </Link>
                    ))}
                    <Link
                      to="/campaigns"
                      className="block mt-4 text-center text-sm text-primary font-heading hover:underline hover:text-shadow-purple transition-colors"
                    >
                      Manage all Campaigns →
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="flex justify-center mb-4">
                      <Crown className="w-12 h-12 text-muted-foreground opacity-50" />
                    </div>
                    <p className="text-muted-foreground font-heading mb-4">
                      No campaigns created yet. Start your first one!
                    </p>
                    <Link to="/campaigns">
                      <Button size="sm" className="btn-shadow-monarch">
                        <Crown className="w-4 h-4 mr-2" />
                        Create Campaign
                      </Button>
                    </Link>
                  </div>
                )}
              </SystemWindow>
            </div>
          )}

          {/* Campaigns & Stats */}
          <div className="space-y-6">
            {/* My Campaigns */}
            <SystemWindow title="MY CAMPAIGNS" variant="alert">
              {myCampaignsLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : recentMyCampaigns.length > 0 ? (
                <div className="space-y-3">
                  {recentMyCampaigns.map((campaign) => (
                    <Link
                      key={campaign.id}
                      to={`/campaigns/${campaign.id}`}
                      className="block p-3 rounded-lg border border-border bg-background/50 hover:bg-muted/50 hover:border-primary/30 transition-all group"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Crown className="w-4 h-4 text-primary" />
                        <h4 className="font-heading font-semibold text-sm group-hover:text-primary transition-colors">
                          {campaign.name}
                        </h4>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {campaign.description || 'No description'}
                      </p>
                    </Link>
                  ))}
                  <Link
                    to="/campaigns"
                    className="block mt-2 text-center text-xs text-primary font-heading hover:underline"
                  >
                    View all →
                  </Link>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Crown className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                  <p className="text-xs text-muted-foreground font-heading mb-3">
                    No campaigns yet
                  </p>
                  <Link to="/campaigns">
                    <Button size="sm" variant="outline" className="text-xs">
                      Create Campaign
                    </Button>
                  </Link>
                </div>
              )}
            </SystemWindow>

            {/* Joined Campaigns */}
            <SystemWindow title="JOINED CAMPAIGNS" variant="default">
              {joinedCampaignsLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : recentJoinedCampaigns.length > 0 ? (
                <div className="space-y-3">
                  {recentJoinedCampaigns.map((campaign) => (
                    <Link
                      key={campaign.id}
                      to={`/campaigns/${campaign.id}`}
                      className="block p-3 rounded-lg border border-border bg-background/50 hover:bg-muted/50 hover:border-primary/30 transition-all group"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="w-4 h-4 text-primary" />
                        <h4 className="font-heading font-semibold text-sm group-hover:text-primary transition-colors">
                          {campaign.name}
                        </h4>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {campaign.description || 'No description'}
                      </p>
                    </Link>
                  ))}
                  <Link
                    to="/campaigns"
                    className="block mt-2 text-center text-xs text-primary font-heading hover:underline"
                  >
                    View all →
                  </Link>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Users className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                  <p className="text-xs text-muted-foreground font-heading mb-3">
                    Not in any campaigns
                  </p>
                  <Link to="/campaigns/join">
                    <Button size="sm" variant="outline" className="text-xs">
                      Join Campaign
                    </Button>
                  </Link>
                </div>
              )}
            </SystemWindow>

            {/* Quick Stats */}
            <SystemWindow title="QUICK STATS" variant="quest">
              <div className="space-y-4">
                <StatItem
                  icon={Sword}
                  label="Total Hunters"
                  value={characters?.length || 0}
                />
                <StatItem
                  icon={Crown}
                  label="Gate Master Campaigns"
                  value={myCampaigns?.length || 0}
                />
                <StatItem
                  icon={Users}
                  label="Joined Campaigns"
                  value={joinedCampaigns?.length || 0}
                />
              </div>
            </SystemWindow>
          </div>
        </div>

        {/* Compendium Quick Stats */}
        <div className="mt-12 mb-8">
          <h2 className="font-heading text-lg font-semibold text-muted-foreground mb-4">
            📚 Compendium Overview
          </h2>
          <CompendiumQuickStats />
        </div>

        {/* Additional Quick Links */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/dice"
            className="glass-card card-shadow-energy p-6 hover:border-primary/30 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Dice1 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-heading font-semibold mb-1 group-hover:text-primary transition-colors">
                  Dice Roller
                </h3>
                <p className="text-sm text-muted-foreground">
                  Roll dice for your Hunter
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/dm-tools"
            className="glass-card card-shadow-energy p-6 hover:border-primary/30 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Settings className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-heading font-semibold mb-1 group-hover:text-primary transition-colors">
                  System Tools
                </h3>
                <p className="text-sm text-muted-foreground">
                  The System's domain
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/compendium"
            className="glass-card card-shadow-energy p-6 hover:border-primary/30 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-heading font-semibold mb-1 group-hover:text-primary transition-colors">
                  Browse Compendium
                </h3>
                <p className="text-sm text-muted-foreground">
                  Explore all knowledge
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

interface QuickActionCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  href: string;
  variant?: 'primary' | 'default';
  graphic?: React.ReactNode;
}

function QuickActionCard({ icon: Icon, title, description, href, variant = 'default', graphic }: QuickActionCardProps) {
  return (
    <Link
      to={href}
      className={cn(
        "glass-card card-shadow-energy p-6 hover:border-primary/30 transition-all group relative overflow-hidden",
        variant === 'primary' && "border-primary/20 bg-primary/5 shadow-monarch-glow"
      )}
    >
      {/* Background graphic */}
      {graphic && (
        <div className="absolute top-0 right-0 opacity-10 group-hover:opacity-20 transition-opacity">
          {graphic}
        </div>
      )}
      
      <div className="flex items-start gap-4 relative z-10">
        <div className={cn(
          "w-12 h-12 rounded-lg flex items-center justify-center transition-colors",
          variant === 'primary' 
            ? "bg-primary/20 group-hover:bg-primary/30" 
            : "bg-primary/10 group-hover:bg-primary/20"
        )}>
          <Icon className={cn(
            "w-6 h-6 transition-colors",
            variant === 'primary' ? "text-primary" : "text-primary"
          )} />
        </div>
        <div className="flex-1">
          <h3 className="font-heading font-semibold mb-1 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        </div>
        <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
      </div>
    </Link>
  );
}

interface StatItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
}

function StatItem({ icon: Icon, label, value }: StatItemProps) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <span className="text-sm font-heading text-muted-foreground">{label}</span>
      </div>
      <span className="text-lg font-display font-bold text-primary">{value}</span>
    </div>
  );
}

// Unauthenticated Welcome Screen - For new users
function UnauthenticatedWelcomeScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/5">
      {/* Supreme Deity's Domain - Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] bg-gradient-radial from-shadow-blue/8 via-shadow-purple/4 to-transparent rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-[150px] h-[150px] sm:w-[250px] sm:h-[250px] md:w-[350px] md:h-[350px] lg:w-[400px] lg:h-[400px] bg-gradient-radial from-arise-violet/6 via-shadow-purple/3 to-transparent rounded-full blur-3xl animate-pulse-glow-delay-1s" />

        {/* Subtle grid overlay - System interface */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `linear-gradient(hsl(var(--shadow-blue)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--shadow-blue)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10 max-w-full overflow-x-hidden">
        {/* Header - The System's Domain */}
        <div className="text-center mb-12 animate-slide-up">
          <div className="inline-block mb-6">
            <SystemWindow variant="arise" className="px-6 py-2" animated>
              <div className="flex items-center gap-2 font-heading">
                <Skull className="w-4 h-4 text-arise-violet" />
                <span className="text-sm gradient-text-arise font-semibold tracking-wide">The System's Domain</span>
                <Sparkles className="w-4 h-4 text-shadow-purple" />
              </div>
            </SystemWindow>
          </div>

          {/* Supreme Deity Logo - Supreme variant */}
          <div className="flex justify-center mb-6">
            <ShadowMonarchLogo size="lg" variant="supreme" className="drop-shadow-2xl" />
          </div>

          <h1 className="font-arise text-4xl sm:text-5xl lg:text-6xl font-black mb-4">
            <span className="gradient-text-arise text-glow-arise">WELCOME, HUNTER</span>
          </h1>
          <p className="text-muted-foreground font-heading max-w-2xl mx-auto leading-relaxed mb-8">
            The System awaits your awakening. In the world reset by the Supreme Deity,
            your journey as a Hunter begins here.
          </p>
        </div>

        {/* Welcome Message */}
        <div className="max-w-3xl mx-auto mb-12">
          <SystemWindow title="THE SYSTEM'S WELCOME" variant="monarch" className="text-center">
            <div className="space-y-6">
              <p className="text-muted-foreground font-heading leading-relaxed">
                <span className="gradient-text-shadow font-semibold">Greetings, potential Hunter.</span>
                The System has detected your presence in the post-reset timeline.
                To begin your journey and access the full power of the System's Compendium,
                you must first awaken as a Hunter.
              </p>

              <p className="text-muted-foreground font-heading leading-relaxed">
                Once awakened, you'll gain access to:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <BookOpen className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-primary mb-1">Complete Compendium</h4>
                    <p className="text-sm text-muted-foreground">All knowledge of the Solo Leveling universe</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <Users className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-primary mb-1">Character Management</h4>
                    <p className="text-sm text-muted-foreground">Create and track your Hunters</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <UsersRound className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-primary mb-1">Campaign System</h4>
                    <p className="text-sm text-muted-foreground">Join or create campaigns with other Hunters</p>
                  </div>
                </div>
              </div>
            </div>
          </SystemWindow>
        </div>

        {/* Main Action - Awaken Hunter */}
        <div className="max-w-2xl mx-auto mb-12">
          <SystemWindow title="BEGIN YOUR JOURNEY" variant="quest" className="text-center">
            <div className="space-y-6">
              <p className="text-muted-foreground font-heading">
                Ready to step into the world of Gates, Shadows, and Monarchs?
              </p>

              <Link to="/characters/new">
                <Button size="lg" className="btn-shadow-monarch shadow-monarch-glow w-full max-w-sm mx-auto">
                  <Zap className="w-5 h-5 mr-3" />
                  <span className="font-heading font-semibold">AWAKEN AS HUNTER</span>
                </Button>
              </Link>

              <p className="text-xs text-muted-foreground font-heading">
                Already have an account? The System will recognize your return.
              </p>
            </div>
          </SystemWindow>
        </div>

        {/* Quick Access - For exploration */}
        <div className="max-w-4xl mx-auto">
          <h3 className="font-heading text-lg font-semibold text-muted-foreground mb-4 text-center">
            Explore the System (No Awakening Required)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              to="/compendium"
              className="glass-card card-shadow-energy p-6 hover:border-primary/30 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold mb-1 group-hover:text-primary transition-colors">
                    Browse Compendium
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Explore all knowledge of the Solo Leveling universe
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all mt-2" />
            </Link>

            <Link
              to="/dice"
              className="glass-card card-shadow-energy p-6 hover:border-primary/30 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Dice1 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold mb-1 group-hover:text-primary transition-colors">
                    Dice Roller
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Roll virtual dice for your tabletop games
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all mt-2" />
            </Link>

            <Link
              to="/dm-tools"
              className="glass-card card-shadow-energy p-6 hover:border-primary/30 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Settings className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold mb-1 group-hover:text-primary transition-colors">
                    DM Tools
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Tools for Game Masters and Supreme Deities
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all mt-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
