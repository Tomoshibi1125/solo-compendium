/**
 * Enhanced Player Tools Page - D&D Beyond Style Layout
 * Role-based tools for players in System Ascendant
 */

import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Shield, 
  BookOpen,
  Heart,
  Star,
  Target,
  Zap,
  Users,
  Map,
  Dice6,
  Store,
  FlaskConical,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Award,
  Crown,
  Sword,
  Gem,
  Compass,
  Settings,
  HelpCircle,
  LogOut,
  Bell,
  Search,
  Filter,
  Grid3x3,
  List
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { SystemSigilLogo } from '@/components/ui/SystemSigilLogo';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useActiveCharacter } from '@/hooks/useActiveCharacter';
import { formatMonarchVernacular } from '@/lib/vernacular';
import './PlayerTools.css';

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
    category: 'core',
    priority: 1,
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
    category: 'core',
    priority: 2,
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
    category: 'core',
    priority: 3,
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
    category: 'creative',
    priority: 4,
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
    category: 'reference',
    priority: 5,
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
    category: 'progression',
    priority: 6,
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
    category: 'social',
    priority: 7,
  },
  {
    id: 'dice-roller',
    name: 'Dice Roller',
    description: 'Advanced dice rolling with modifiers and history.',
    icon: Dice6,
    status: 'available',
    color: 'from-red-500/20 to-red-600/10 border-red-500/30 hover:border-red-500/60',
    iconColor: 'text-red-400',
    glow: 'group-hover:shadow-red-500/20',
    category: 'tools',
    priority: 8,
  },
  {
    id: 'marketplace',
    name: 'Marketplace',
    description: 'Browse and purchase items, equipment, and services.',
    icon: Store,
    status: 'available',
    color: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30 hover:border-yellow-500/60',
    iconColor: 'text-yellow-400',
    glow: 'group-hover:shadow-yellow-500/20',
    category: 'economy',
    priority: 9,
  },
  {
    id: 'potions',
    name: 'Potions & Consumables',
    description: 'Manage your potions, elixirs, and consumable items.',
    icon: FlaskConical,
    status: 'available',
    color: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 hover:border-emerald-500/60',
    iconColor: 'text-emerald-400',
    glow: 'group-hover:shadow-emerald-500/20',
    category: 'inventory',
    priority: 10,
  },
  {
    id: 'achievements',
    name: 'Achievements',
    description: 'View your accomplishments and unlock rewards.',
    icon: Award,
    status: 'available',
    color: 'from-amber-500/20 to-amber-600/10 border-amber-500/30 hover:border-amber-500/60',
    iconColor: 'text-amber-400',
    glow: 'group-hover:shadow-amber-500/20',
    category: 'progression',
    priority: 11,
  },
  {
    id: 'regent-status',
    name: `${formatMonarchVernacular('Regent')} Status`,
    description: `Manage your ${formatMonarchVernacular('regent')} domains and powers.`,
    icon: Crown,
    status: 'high-level',
    color: 'from-violet-500/20 to-violet-600/10 border-violet-500/30 hover:border-violet-500/60',
    iconColor: 'text-violet-400',
    glow: 'group-hover:shadow-violet-500/20',
    category: 'high-level',
    priority: 12,
  },
];

const categories = [
  { id: 'all', name: 'All Tools', icon: Grid3x3 },
  { id: 'core', name: 'Core', icon: Heart },
  { id: 'creative', name: 'Creative', icon: Sparkles },
  { id: 'reference', name: 'Reference', icon: BookOpen },
  { id: 'progression', name: 'Progression', icon: TrendingUp },
  { id: 'social', name: 'Social', icon: Users },
  { id: 'tools', name: 'Tools', icon: Settings },
  { id: 'economy', name: 'Economy', icon: Store },
  { id: 'inventory', name: 'Inventory', icon: Shield },
  { id: 'high-level', name: 'High Level', icon: Crown },
];

const PlayerTools = () => {
  const navigate = useNavigate();
  const { activeCharacter, isLoading: characterLoading } = useActiveCharacter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter tools based on search and category
  const filteredTools = useMemo(() => {
    return playerTools.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Group tools by category
  const toolsByCategory = useMemo(() => {
    const grouped = categories.reduce((acc, category) => {
      acc[category.id] = filteredTools.filter(tool => 
        category.id === 'all' || tool.category === category.id
      );
      return acc;
    }, {} as Record<string, typeof playerTools>);
    return grouped;
  }, [filteredTools]);

  if (characterLoading) {
    return (
      <Layout>
        <div className="player-tools-loading">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!activeCharacter) {
    return (
      <Layout>
        <div className="player-tools-container">
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
            <User className="w-16 h-16 text-muted-foreground/50" />
            <div>
              <h2 className="text-2xl font-heading font-bold mb-2">No Character Found</h2>
              <p className="text-muted-foreground max-w-md">
                You need to create a character before accessing Player Tools.
                Build your Ascendant and start your journey through the System.
              </p>
            </div>
            <Button size="lg" onClick={() => navigate('/characters/new')}>
              <Sparkles className="w-5 h-5 mr-2" />
              Create Your First Character
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="player-tools-container">
        {/* Header */}
        <div className="player-tools-header">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="player-tools-title">
                Player Tools
              </h1>
              <p className="player-tools-subtitle">
                Manage your Ascendant's journey through the System
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => navigate('/compendium')}>
                <HelpCircle className="w-4 h-4 mr-2" />
                Help
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate('/profile')}>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          {/* Character Status Bar */}
          {activeCharacter && (
            <div className="character-status-bar">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="character-avatar">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="character-name">{activeCharacter.name}</div>
                    <div className="character-details">
                      Level {activeCharacter.level} {activeCharacter.background || 'Unknown'} {activeCharacter.job}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="stat-item">
                    <span className="stat-label">HP</span>
                    <span className="stat-value">{activeCharacter.hp_current}/{activeCharacter.hp_max}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">AC</span>
                    <span className="stat-value">{activeCharacter.armor_class || 10}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">XP</span>
                    <span className="stat-value">{activeCharacter.experience || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Search and Filters */}
        <div className="player-tools-filters">
          <div className="search-bar">
            <Search className="w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 focus:ring-0"
            />
          </div>
          
          <div className="filter-controls">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        {category.name}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            
            <div className="view-toggle">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Tools Content */}
        <div className="player-tools-content">
          {selectedCategory === 'all' ? (
            // Categorized view
            <div className="space-y-8">
              {categories.filter(cat => cat.id !== 'all').map((category) => {
                const categoryTools = toolsByCategory[category.id];
                if (categoryTools.length === 0) return null;
                
                const Icon = category.icon;
                return (
                  <div key={category.id} className="category-section">
                    <div className="category-header">
                      <div className="flex items-center gap-2">
                        <Icon className="w-5 h-5" />
                        <h2 className="category-title">{category.name}</h2>
                        <Badge variant="secondary">{categoryTools.length}</Badge>
                      </div>
                    </div>
                    
                    <div className={cn(
                      "tools-grid",
                      viewMode === 'list' ? "tools-list" : "tools-grid"
                    )}>
                      {categoryTools.map((tool) => (
                        <ToolCard key={tool.id} tool={tool} viewMode={viewMode} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // Single category view
            <div className={cn(
              "tools-grid",
              viewMode === 'list' ? "tools-list" : "tools-grid"
            )}>
              {filteredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} viewMode={viewMode} />
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="player-tools-quick-actions">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Common tasks and shortcuts for your Ascendant
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button variant="outline" className="justify-start" onClick={() => activeCharacter ? navigate(`/characters/${activeCharacter.id}`) : navigate('/characters/new')}>
                  <Sword className="w-4 h-4 mr-2" />
                  Combat Mode
                </Button>
                <Button variant="outline" className="justify-start" onClick={() => navigate('/dice')}>
                  <Dice6 className="w-4 h-4 mr-2" />
                  Quick Roll
                </Button>
                <Button variant="outline" className="justify-start" onClick={() => activeCharacter ? navigate(`/characters/${activeCharacter.id}`) : navigate('/characters/new')}>
                  <Heart className="w-4 h-4 mr-2" />
                  Rest & Recover
                </Button>
                <Button variant="outline" className="justify-start" onClick={() => navigate('/dm-tools/vtt')}>
                  <Map className="w-4 h-4 mr-2" />
                  View Map
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

// Tool Card Component
const ToolCard = ({ tool, viewMode }: { tool: typeof playerTools[0]; viewMode: 'grid' | 'list' }) => {
  const Icon = tool.icon;
  
  if (viewMode === 'list') {
    return (
      <Link to={`/player-tools/${tool.id}`} className="block">
        <Card className="tool-card-list">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={cn("tool-icon-list", tool.iconColor)}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="tool-title-list">{tool.name}</h3>
                  <p className="tool-description-list">{tool.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {tool.status === 'campaign-only' && (
                  <Badge variant="outline">Campaign</Badge>
                )}
                {tool.status === 'high-level' && (
                  <Badge variant="outline">High Level</Badge>
                )}
                <Button size="sm">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }
  
  return (
    <Link to={`/player-tools/${tool.id}`} className="block">
      <Card className={cn("tool-card", tool.color, tool.glow)}>
        <CardHeader className="pb-3">
          <div className={cn("tool-icon", tool.iconColor)}>
            <Icon className="w-8 h-8" />
          </div>
          <CardTitle className="tool-title">{tool.name}</CardTitle>
          <CardDescription className="tool-description">
            {tool.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {tool.status === 'campaign-only' && (
                <Badge variant="outline" className="text-xs">Campaign</Badge>
              )}
              {tool.status === 'high-level' && (
                <Badge variant="outline" className="text-xs">High Level</Badge>
              )}
              {tool.status === 'available' && (
                <Badge variant="secondary" className="text-xs">Available</Badge>
              )}
            </div>
            <Button size="sm" className="tool-action">
              Launch
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default PlayerTools;
