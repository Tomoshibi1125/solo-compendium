import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
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
  Globe,
  Image as ImageIcon,
  Database,
  BarChart3,
  Layers,
  Menu,
  X,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';

interface MobileToolCardProps {
  tool: {
    id: string;
    name: string;
    description: string;
    icon: any;
    color: string;
    iconColor: string;
    status: string;
  };
  isMobile?: boolean;
  onToolSelect?: (toolId: string) => void;
  isSelected?: boolean;
}

const MobileToolCard = ({ tool, isMobile = false, onToolSelect, isSelected }: MobileToolCardProps) => {
  const Icon = tool.icon;
  
  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md",
        isMobile ? "border-l-4" : "border-l-0",
        isSelected && "ring-2 ring-primary/20",
        tool.color
      )}
      onClick={() => onToolSelect?.(tool.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={cn(
            "p-2 rounded-lg flex-shrink-0",
            tool.color,
            tool.iconColor
          )}>
            <Icon className={cn(
              isMobile ? "w-5 h-5" : "w-6 h-6"
            )} />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className={cn(
              "font-semibold text-sm leading-tight",
              isMobile ? "text-base" : "text-lg"
            )}>
              {tool.name}
            </h3>
            <p className={cn(
              "text-muted-foreground mt-1 line-clamp-2",
              isMobile ? "text-xs" : "text-sm"
            )}>
              {tool.description}
            </p>
            
            {tool.status && (
              <Badge 
                variant={tool.status === 'available' ? 'default' : 'secondary'}
                className="mt-2 text-xs"
              >
                {tool.status}
              </Badge>
            )}
          </div>
          
          {isMobile && (
            <ChevronRight className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface MobileDMToolsProps {
  tools: Array<{
    id: string;
    name: string;
    description: string;
    icon: any;
    color: string;
    iconColor: string;
    status: string;
  }>;
  onToolSelect: (toolId: string) => void;
  selectedTool: string | null;
  isMobile: boolean;
}

const MobileDMTools = ({ tools, onToolSelect, selectedTool, isMobile }: MobileDMToolsProps) => {
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);
  
  if (isMobile) {
    return (
      <div className="space-y-4">
        {/* Mobile Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Crown className="w-6 h-6 text-amber-500" />
            DM Tools
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="lg:hidden"
          >
            {showMobileMenu ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>
        </div>

        {/* Mobile Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tools.map((tool) => (
            <MobileToolCard
              key={tool.id}
              tool={tool}
              isMobile={true}
              onToolSelect={onToolSelect}
              isSelected={selectedTool === tool.id}
            />
          ))}
        </div>

        {/* Mobile Quick Actions */}
        {selectedTool && (
          <Card className="mt-6 border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="w-full">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  New
                </Button>
              </div>
              <Button variant="destructive" size="sm" className="w-full">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Desktop Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <Crown className="w-8 h-8 text-amber-500" />
          DM Tools Dashboard
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Database className="w-4 h-4 mr-2" />
            Manage
          </Button>
          <Button variant="outline" size="sm">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </Button>
        </div>
      </div>

      {/* Desktop Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <MobileToolCard
            key={tool.id}
            tool={tool}
            isMobile={false}
            onToolSelect={onToolSelect}
            isSelected={selectedTool === tool.id}
          />
        ))}
      </div>

      {/* Desktop Quick Actions Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings2 className="w-5 h-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button variant="outline" className="justify-start">
                <Plus className="w-4 h-4 mr-2" />
                Create New Content
              </Button>
              <Button variant="outline" className="justify-start">
                <Users className="w-4 h-4 mr-2" />
                Manage Players
              </Button>
              <Button variant="outline" className="justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Session
              </Button>
              <Button variant="outline" className="justify-start">
                <Target className="w-4 h-4 mr-2" />
                Quick Encounter
              </Button>
              <Button variant="outline" className="justify-start">
                <Globe className="w-4 h-4 mr-2" />
                World Builder
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">Last Session</span>
                </div>
                <span className="text-sm text-muted-foreground">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-green-500" />
                  <span className="font-medium">Active Players</span>
                </div>
                <span className="text-sm text-muted-foreground">4 online</span>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="font-medium">Encounters Today</span>
                </div>
                <span className="text-sm text-muted-foreground">3 completed</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MobileDMTools;
