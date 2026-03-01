/**
 * Integrated DM Tools Panel for VTT
 * Provides all essential DM tools without leaving the VTT interface
 */

import React, { useState } from 'react';
import {
  Users,
  Sword,
  MapPin,
  Dice1,
  BookOpen,
  Package,
  Sparkles,
  Heart,
  Music,
  Settings,
  Plus,
  Minus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Zap,
  Shield,
  Crown,
  Skull,
  Gem,
  Coins,
  DoorOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { SystemWindow } from '@/components/ui/SystemWindow';
import QuestGenerator from '@/pages/dm-tools/QuestGenerator';
import EncounterBuilder from '@/pages/dm-tools/EncounterBuilder';
import TreasureGenerator from '@/pages/dm-tools/TreasureGenerator';
import RandomEventGenerator from '@/pages/dm-tools/RandomEventGenerator';
import GateGenerator from '@/pages/dm-tools/GateGenerator';
import RelicWorkshop from '@/pages/dm-tools/RelicWorkshop';
import RollableTables from '@/pages/dm-tools/RollableTables';
import NPCGenerator from '@/pages/dm-tools/NPCGenerator';
import DungeonMapGenerator from '@/pages/dm-tools/DungeonMapGenerator';
import ArtGenerator from '@/pages/dm-tools/ArtGenerator';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useGlobalDDBeyondIntegration } from '@/hooks/useGlobalDDBeyondIntegration';

interface DMToolsPanelProps {
  campaignId?: string;
  /** Callback to roll dice into VTT chat (typically vttRealtime.rollAndBroadcast) */
  onRoll?: (formula: string, type?: 'dice' | 'gmroll') => void;
  onAddToken?: (token: any) => void;
  onAddEffect?: (effect: any) => void;
  onPlaySound?: (soundId: string) => void;
  onMusicChange?: (musicId: string) => void;
  className?: string;
}

export const DMToolsPanel: React.FC<DMToolsPanelProps> = ({
  campaignId,
  onRoll,
  onAddToken,
  onAddEffect,
  onPlaySound,
  onMusicChange,
  className
}) => {
  const { toast } = useToast();
  const { usePlayerToolsEnhancements } = useGlobalDDBeyondIntegration();
  const ddbTools = usePlayerToolsEnhancements();
  const [activeTool, setActiveTool] = useState<string>('encounter');
  const [quickRollValue, setQuickRollValue] = useState('1d20');
  const [quickRollResult, setQuickRollResult] = useState<number | null>(null);

  const logDMMacro = (macroName: string, detail: string) => {
    ddbTools.trackCustomFeatureUsage('DM', `DM Macro: ${macroName}`, detail, 'SA').catch(console.error);
  };

  // Quick roll — routes through VTT realtime engine (crit detection, chat broadcast, Supabase persistence)
  const handleQuickRoll = () => {
    try {
      if (onRoll) {
        // Use VTT engine (Roll20-class: kh/kl, exploding, multi-term, crit detection)
        onRoll(quickRollValue, 'dice');
        logDMMacro('Quick Roll', quickRollValue);
        // We don't have the result here; it will appear in VTT chat
        setQuickRollResult(null);
      } else {
        // Offline fallback: simple local parser
        const match = quickRollValue.match(/(\d+)d(\d+)/);
        if (match) {
          const numDice = parseInt(match[1]);
          const dieSize = parseInt(match[2]);
          let total = 0;
          for (let i = 0; i < numDice; i++) {
            total += Math.floor(Math.random() * dieSize) + 1;
          }
          setQuickRollResult(total);
          toast({ title: 'Quick Roll', description: `${quickRollValue} = ${total}` });
        }
      }
    } catch (error) {
      toast({
        title: 'Invalid Roll',
        description: "Please use format like '1d20', '2d6', etc.",
        variant: 'destructive',
      });
    }
  };

  // Quick sound effects
  const quickSounds = [
    { id: 'door-creak', name: 'Door Creak', icon: '🚪' },
    { id: 'sword-clash', name: 'Sword Clash', icon: '⚔️' },
    { id: 'fireball', name: 'Fireball', icon: '🔥' },
    { id: 'thunder', name: 'Thunder', icon: '⛈️' },
    { id: 'heal', name: 'Healing', icon: '✨' },
    { id: 'monster-roar', name: 'Monster Roar', icon: '👹' },
  ];

  // Quick music moods
  const quickMusic = [
    { id: 'combat-epic', name: 'Epic Combat', mood: 'tense' },
    { id: 'explore-dungeon', name: 'Dungeon Explore', mood: 'mysterious' },
    { id: 'social-tavern', name: 'Tavern Social', mood: 'peaceful' },
    { id: 'horror-dread', name: 'Horror Dread', mood: 'scary' },
  ];

  return (
    <div className={cn("space-y-4", className)}>
      {/* Quick Actions Bar */}
      <SystemWindow title="QUICK ACTIONS" compact>
        <div className="grid grid-cols-2 gap-2">
          {/* Quick Dice Roll */}
          <div className="space-y-2">
            <Label className="text-xs">Quick Roll</Label>
            <div className="flex gap-1">
              <Input
                value={quickRollValue}
                onChange={(e) => setQuickRollValue(e.target.value)}
                placeholder="1d20"
                className="h-8 text-xs"
              />
              <Button size="sm" onClick={handleQuickRoll} className="h-8">
                <Dice1 className="w-3 h-3" />
              </Button>
            </div>
            {quickRollResult !== null && (
              <div className="text-center text-xs font-bold text-primary">
                Result: {quickRollResult}
              </div>
            )}
          </div>

          {/* Quick Sound Effects */}
          <div className="space-y-2">
            <Label className="text-xs">Quick Sounds</Label>
            <div className="grid grid-cols-3 gap-1">
              {quickSounds.map((sound) => (
                <Button
                  key={sound.id}
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    onPlaySound?.(sound.id);
                    logDMMacro('Sound Effect', sound.name);
                  }}
                  className="h-8 text-xs p-1"
                  title={sound.name}
                >
                  {sound.icon}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Music */}
        <div className="space-y-2 pt-2 border-t border-border/50">
          <Label className="text-xs">Quick Music</Label>
          <div className="grid grid-cols-2 gap-1">
            {quickMusic.map((music) => (
              <Button
                key={music.id}
                size="sm"
                variant="outline"
                onClick={() => {
                  onMusicChange?.(music.id);
                  logDMMacro('Music Change', music.name);
                }}
                className="h-8 text-xs"
              >
                {music.name}
              </Button>
            ))}
          </div>
        </div>
      </SystemWindow>

      {/* Full DM Tools */}
      <SystemWindow title="DM TOOLS">
        <Tabs value={activeTool} onValueChange={setActiveTool} className="w-full">
          <TabsList className="grid w-full grid-cols-4 h-auto">
            <TabsTrigger value="encounter" className="flex-col gap-1 p-2">
              <Sword className="w-4 h-4" />
              <span className="text-xs">Encounter</span>
            </TabsTrigger>
            <TabsTrigger value="generators" className="flex-col gap-1 p-2">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs">Generators</span>
            </TabsTrigger>
            <TabsTrigger value="tables" className="flex-col gap-1 p-2">
              <BookOpen className="w-4 h-4" />
              <span className="text-xs">Tables</span>
            </TabsTrigger>
            <TabsTrigger value="tools" className="flex-col gap-1 p-2">
              <Settings className="w-4 h-4" />
              <span className="text-xs">Tools</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="encounter" className="space-y-4">
            <EncounterBuilder />
          </TabsContent>

          <TabsContent value="generators" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="h-12 flex-col gap-1">
                    <Users className="w-4 h-4" />
                    <span className="text-xs">NPC</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>NPC Generator</DialogTitle>
                  </DialogHeader>
                  <NPCGenerator />
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="h-12 flex-col gap-1">
                    <MapPin className="w-4 h-4" />
                    <span className="text-xs">Dungeon</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Dungeon Map Generator</DialogTitle>
                  </DialogHeader>
                  <DungeonMapGenerator />
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="h-12 flex-col gap-1">
                    <Coins className="w-4 h-4" />
                    <span className="text-xs">Treasure</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Treasure Generator</DialogTitle>
                  </DialogHeader>
                  <TreasureGenerator />
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="h-12 flex-col gap-1">
                    <Skull className="w-4 h-4" />
                    <span className="text-xs">Random</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Random Event Generator</DialogTitle>
                  </DialogHeader>
                  <RandomEventGenerator />
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="h-12 flex-col gap-1">
                    <DoorOpen className="w-4 h-4" />
                    <span className="text-xs">Rift</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Rift Generator</DialogTitle>
                  </DialogHeader>
                  <GateGenerator />
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="h-12 flex-col gap-1">
                    <Heart className="w-4 h-4" />
                    <span className="text-xs">Relic</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Relic Workshop</DialogTitle>
                  </DialogHeader>
                  <RelicWorkshop />
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="h-12 flex-col gap-1">
                    <BookOpen className="w-4 h-4" />
                    <span className="text-xs">Quest</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Quest Generator</DialogTitle>
                  </DialogHeader>
                  <QuestGenerator />
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="h-12 flex-col gap-1">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-xs">Effect</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Quick Effect</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      {['Fireball', 'Healing', 'Lightning', 'Shield', 'Poison', 'Teleport'].map((effect) => (
                        <Button
                          key={effect}
                          onClick={() => {
                            onAddEffect?.({
                              id: `effect-${Date.now()}`,
                              name: effect,
                              type: 'magic',
                              x: Math.random() * 10,
                              y: Math.random() * 10,
                              radius: 2,
                              color: effect === 'Fireball' ? '#ff6b6b' : effect === 'Healing' ? '#51cf66' : '#339af0',
                            });
                            logDMMacro('Visual Effect', effect);
                            toast({
                              title: "Effect Added",
                              description: `${effect} effect placed on map`,
                            });
                          }}
                          className="h-10 text-xs"
                        >
                          {effect}
                        </Button>
                      ))}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </TabsContent>

          <TabsContent value="tables" className="space-y-4">
            <RollableTables />
          </TabsContent>

          <TabsContent value="tools" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <SystemWindow title="SESSION NOTES" compact>
                <textarea
                  className="w-full h-32 p-2 text-xs bg-background border border-border rounded resize-none"
                  placeholder="Session notes..."
                />
                <div className="flex gap-2 mt-2">
                  <Button size="sm" className="flex-1" onClick={() => {
                    const textarea = document.querySelector('[placeholder="Session notes..."]') as HTMLTextAreaElement;
                    if (textarea?.value.trim()) {
                      localStorage.setItem(`sa-session-notes-${campaignId || 'local'}`, textarea.value);
                      toast({ title: 'Notes Saved', description: 'Session notes saved locally.' });
                    }
                  }}>
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => {
                    const textarea = document.querySelector('[placeholder="Session notes..."]') as HTMLTextAreaElement;
                    if (textarea) { textarea.value = ''; }
                    localStorage.removeItem(`sa-session-notes-${campaignId || 'local'}`);
                    toast({ title: 'Notes Cleared' });
                  }}>
                    Clear
                  </Button>
                </div>
              </SystemWindow>

              <SystemWindow title="PARTY STATUS" compact>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs">Party Level</span>
                    <Badge variant="outline" className="text-xs">5-7</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs">Party Size</span>
                    <Badge variant="outline" className="text-xs">4-5</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs">Difficulty</span>
                    <Select defaultValue="medium">
                      <SelectTrigger className="h-8 text-xs">
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
                </div>
              </SystemWindow>
            </div>

            <SystemWindow title="ATMOSPHERE" compact>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Lighting</Label>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => { onAddEffect?.({ id: 'bright', name: 'Bright Light', type: 'light', radius: 10, color: '#fff59d' }); logDMMacro('Lighting', 'Bright Light'); }}>
                      <Eye className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => { onAddEffect?.({ id: 'dim', name: 'Dim Light', type: 'light', radius: 5, color: '#ffecb3' }); logDMMacro('Lighting', 'Dim Light'); }}>
                      <EyeOff className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => { onAddEffect?.({ id: 'darkness', name: 'Darkness', type: 'dark', radius: 8, color: '#000000' }); logDMMacro('Lighting', 'Darkness'); }}>
                      <Minus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Weather</Label>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => { onPlaySound?.('rain'); logDMMacro('Weather', 'Rain'); }}>
                      🌧️
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => { onPlaySound?.('thunder'); logDMMacro('Weather', 'Thunder'); }}>
                      ⛈️
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => { onPlaySound?.('wind'); logDMMacro('Weather', 'Wind'); }}>
                      💨
                    </Button>
                  </div>
                </div>
              </div>
            </SystemWindow>
          </TabsContent>
        </Tabs>
      </SystemWindow>
    </div>
  );
};
