import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { 
  Sword, 
  Users, 
  Shield, 
  Zap, 
  Plus,
  Edit,
  Trash2,
  Save,
  Eye,
  Download,
  Upload,
  Settings,
  Grid,
  List,
  X,
  ChevronLeft,
  ChevronRight,
  Menu,
  ArrowLeft,
  RefreshCw
} from 'lucide-react';

// Touch gesture hook
const useTouchGestures = (elementRef: React.RefObject<HTMLElement>) => {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);
  
  const minSwipeDistance = 50;
  
  const onTouchStart = useCallback((e: TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  }, []);
  
  const onTouchMove = useCallback((e: TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  }, []);
  
  const onTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;
    
    const distance = Math.sqrt(
      Math.pow(touchEnd.x - touchStart.x, 2) + 
      Math.pow(touchEnd.y - touchStart.y, 2)
    );
    
    if (distance < minSwipeDistance) return;
    
    const direction = {
      left: touchEnd.x < touchStart.x - minSwipeDistance,
      right: touchEnd.x > touchStart.x + minSwipeDistance,
      up: touchEnd.y < touchStart.y - minSwipeDistance,
      down: touchEnd.y > touchStart.y + minSwipeDistance
    };
    
    // Custom event for swipe direction
    const event = new CustomEvent('swipe', { 
      detail: { direction, touchStart, touchEnd } 
    });
    elementRef.current?.dispatchEvent(event);
  }, [touchStart, touchEnd, minSwipeDistance]);
  
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    element.addEventListener('touchstart', onTouchStart);
    element.addEventListener('touchmove', onTouchMove);
    element.addEventListener('touchend', onTouchEnd);
    
    return () => {
      element.removeEventListener('touchstart', onTouchStart);
      element.removeEventListener('touchmove', onTouchMove);
      element.removeEventListener('touchend', onTouchEnd);
    };
  }, [onTouchStart, onTouchMove, onTouchEnd, elementRef]);
  
  return { touchStart, touchEnd };
};

// Haptic feedback hook
const useHapticFeedback = () => {
  const vibrate = useCallback((pattern: number | number[] = 10) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }, []);
  
  const lightHaptic = useCallback(() => vibrate(10), [vibrate]);
  const mediumHaptic = useCallback(() => vibrate(25), [vibrate]);
  const heavyHaptic = useCallback(() => vibrate(50), [vibrate]);
  const successHaptic = useCallback(() => vibrate([10, 50, 10]), [vibrate]);
  const errorHaptic = useCallback(() => vibrate([100, 50, 100]), [vibrate]);
  
  return {
    vibrate,
    lightHaptic,
    mediumHaptic,
    heavyHaptic,
    successHaptic,
    errorHaptic
  };
};

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  title: string;
  isMobile: boolean;
  onMobileMenuToggle?: () => void;
  showMobileMenu?: boolean;
}

const ResponsiveLayout = ({ children, title, isMobile, onMobileMenuToggle, showMobileMenu }: ResponsiveLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      {isMobile && (
        <header className="sticky top-0 z-50 bg-background border-b">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-lg font-semibold truncate">{title}</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={onMobileMenuToggle}
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Grid className="w-5 h-5" />}
            </Button>
          </div>
        </header>
      )}

      {/* Desktop Header */}
      {!isMobile && (
        <header className="sticky top-0 z-50 bg-background border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">{title}</h1>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
                <Button variant="outline" size="sm">
                  <Users className="w-4 h-4 mr-2" />
                  Players
                </Button>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className={cn(
        "container mx-auto",
        isMobile ? "px-4 py-6" : "px-6 py-8"
      )}>
        <div className={cn(
          "grid gap-6",
          isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-4"
        )}>
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 bg-background border-t z-50">
          <div className="grid grid-cols-4 gap-1 p-2">
            <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 h-auto py-2">
              <Grid className="w-4 h-4" />
              <span className="text-xs">Tools</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 h-auto py-2">
              <Users className="w-4 h-4" />
              <span className="text-xs">Players</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 h-auto py-2">
              <Shield className="w-4 h-4" />
              <span className="text-xs">Security</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 h-auto py-2">
              <Settings className="w-4 h-4" />
              <span className="text-xs">Settings</span>
            </Button>
          </div>
        </nav>
      )}
    </div>
  );
};

interface MobileEncounterBuilderProps {
  isMobile: boolean;
}

const MobileEncounterBuilder = ({ isMobile }: MobileEncounterBuilderProps) => {
  const [encounterName, setEncounterName] = useState('');
  const [selectedMonsters, setSelectedMonsters] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState('medium');
  const [showPreview, setShowPreview] = useState(false);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sword className="w-5 h-5" />
          Encounter Builder
        </CardTitle>
        {!isMobile && (
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Encounter Name */}
        <div className="space-y-2">
          <Label htmlFor="encounter-name">Encounter Name</Label>
          <Input
            id="encounter-name"
            placeholder="Enter encounter name..."
            value={encounterName}
            onChange={(e) => setEncounterName(e.target.value)}
            className={isMobile ? "text-sm" : ""}
          />
        </div>

        {/* Difficulty Selection */}
        <div className="space-y-2">
          <Label>Difficulty</Label>
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger className={isMobile ? "text-sm" : ""}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
              <SelectItem value="deadly">Deadly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Monster Selection */}
        <div className="space-y-2">
          <Label>Monsters</Label>
          <div className={cn(
            "border rounded-lg p-3 min-h-[100px]",
            isMobile ? "text-sm" : ""
          )}>
            <div className="text-center text-muted-foreground">
              <Plus className="w-8 h-8 mx-auto mb-2" />
              <p>Add monsters to build encounter</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => {/* Open monster selector */}}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Monster
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Action Buttons */}
        {isMobile && (
          <div className="grid grid-cols-2 gap-2 mt-4">
            <Button variant="outline" size="sm" className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm" className="w-full">
              <Zap className="w-4 h-4 mr-2" />
              Test Run
            </Button>
          </div>
        )}

        {/* Desktop Action Buttons */}
        {!isMobile && (
          <div className="flex gap-2 mt-4">
            <Button>
              <Save className="w-4 h-4 mr-2" />
              Save Encounter
            </Button>
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline">
              <Zap className="w-4 h-4 mr-2" />
              Test Balance
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface MobileInitiativeTrackerProps {
  isMobile: boolean;
}

const MobileInitiativeTracker = ({ isMobile }: MobileInitiativeTrackerProps) => {
  const [participants, setParticipants] = useState([
    { id: 1, name: 'Player 1', initiative: 15, hp: 45, maxHp: 45, ac: 16 },
    { id: 2, name: 'Goblin', initiative: 12, hp: 8, maxHp: 8, ac: 15 },
    { id: 3, name: 'Orc', initiative: 10, hp: 15, maxHp: 15, ac: 13 },
  ]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Initiative Tracker
        </CardTitle>
        <div className="flex gap-1">
          <Badge variant="outline">{participants.length} Combatants</Badge>
          {!isMobile && (
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Combatant
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mobile Compact View */}
        {isMobile ? (
          <div className="space-y-2">
            {participants.map((participant) => (
              <div key={participant.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{participant.name}</div>
                    <div className="text-xs text-muted-foreground">Init: {participant.initiative}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{participant.hp}/{participant.maxHp}</div>
                  <div className="text-xs text-muted-foreground">AC: {participant.ac}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Desktop Expanded View */
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Name</th>
                  <th className="text-center p-2">Initiative</th>
                  <th className="text-center p-2">HP</th>
                  <th className="text-center p-2">AC</th>
                  <th className="text-center p-2">Status</th>
                  <th className="text-center p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((participant) => (
                  <tr key={participant.id} className="border-b hover:bg-muted/50">
                    <td className="p-2 font-medium">{participant.name}</td>
                    <td className="p-2 text-center">{participant.initiative}</td>
                    <td className="p-2 text-center">
                      <span className={cn(
                        "font-medium",
                        participant.hp <= participant.maxHp / 2 ? "text-red-600" : 
                        participant.hp <= participant.maxHp * 0.75 ? "text-orange-600" : "text-green-600"
                      )}>
                        {participant.hp}/{participant.maxHp}
                      </span>
                    </td>
                    <td className="p-2 text-center">{participant.ac}</td>
                    <td className="p-2 text-center">
                      <Badge variant={participant.hp > 0 ? "default" : "destructive"}>
                        {participant.hp > 0 ? "Active" : "Down"}
                      </Badge>
                    </td>
                    <td className="p-2 text-center">
                      <div className="flex gap-1 justify-center">
                        <Button size="sm" variant="outline">
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Shield className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Mobile Quick Actions */}
        {isMobile && (
          <div className="grid grid-cols-2 gap-2 mt-4">
            <Button variant="outline" size="sm" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Combatant
            </Button>
            <Button variant="outline" size="sm" className="w-full">
              <Zap className="w-4 h-4 mr-2" />
              Next Turn
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export { ResponsiveLayout, MobileEncounterBuilder, MobileInitiativeTracker };
