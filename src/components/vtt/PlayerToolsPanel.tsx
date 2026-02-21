/**
 * Integrated Player Tools Panel for VTT
 * Provides all essential player tools without leaving the VTT interface
 */

import React, { useState } from 'react';
import { 
  User, 
  Dice1, 
  Heart, 
  Shield, 
  Sword, 
  BookOpen, 
  Zap, 
  MessageSquare, 
  Users, 
  Settings,
  Plus,
  Minus,
  Edit,
  Target,
  Footprints,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface PlayerToolsPanelProps {
  characterId?: string;
  onRollDice?: (formula: string) => void;
  onSendMessage?: (message: string, type?: string) => void;
  onUseAbility?: (ability: string) => void;
  onCastSpell?: (spellId: string) => void;
  onTakeAction?: (action: string) => void;
  className?: string;
}

export const PlayerToolsPanel: React.FC<PlayerToolsPanelProps> = ({
  characterId,
  onRollDice,
  onSendMessage,
  onUseAbility,
  onCastSpell,
  onTakeAction,
  className
}) => {
  const { toast } = useToast();
  const [activeTool, setActiveTool] = useState<string>('actions');
  const [quickRollValue, setQuickRollValue] = useState('1d20');
  const [quickRollResult, setQuickRollResult] = useState<number | null>(null);
  const [customMessage, setCustomMessage] = useState('');
  const [selectedSpell, setSelectedSpell] = useState('');
  const [selectedAbility, setSelectedAbility] = useState('');

  // Quick roll function
  const handleQuickRoll = () => {
    try {
      // Simple dice roll parser
      const match = quickRollValue.match(/(\d+)d(\d+)(?:\s*([+-]\s*\d+))?/);
      if (match) {
        const numDice = parseInt(match[1]);
        const dieSize = parseInt(match[2]);
        const modifier = match[3] ? parseInt(match[3].replace(/\s/g, '')) : 0;
        let total = modifier;
        for (let i = 0; i < numDice; i++) {
          total += Math.floor(Math.random() * dieSize) + 1;
        }
        setQuickRollResult(total);
        onRollDice?.(quickRollValue);
        toast({
          title: "Dice Roll",
          description: `${quickRollValue} = ${total}`,
        });
      }
    } catch (error) {
      toast({
        title: "Invalid Roll",
        description: "Please use format like '1d20', '2d6+3', etc.",
        variant: "destructive",
      });
    }
  };

  // Common dice rolls
  const commonRolls = [
    { formula: '1d20', name: 'Attack/Check', icon: '🎯' },
    { formula: '1d20+5', name: 'Advantage', icon: '⬆️' },
    { formula: '1d20-5', name: 'Disadvantage', icon: '⬇️' },
    { formula: '2d6', name: 'Damage', icon: '⚔️' },
    { formula: '1d8', name: 'Healing', icon: '💚' },
    { formula: '1d4', name: 'Bonus', icon: '✨' },
  ];

  // Quick actions
  const quickActions = [
    { id: 'attack', name: 'Attack', icon: '⚔️', description: 'Make an attack roll' },
    { id: 'dodge', name: 'Dodge', icon: '🛡️', description: 'Dodge incoming attack' },
    { id: 'cast', name: 'Cast Spell', icon: '🔮', description: 'Cast a prepared spell' },
    { id: 'use-item', name: 'Use Item', icon: '📿', description: 'Use an item from inventory' },
    { id: 'help', name: 'Help Ally', icon: '🤝', description: 'Help an adjacent ally' },
    { id: 'hide', name: 'Hide', icon: '👁️', description: 'Attempt to hide' },
  ];

  // Quick spells
  const quickSpells = [
    { id: 'fireball', name: 'Fireball', icon: '🔥', level: 3, description: 'Area damage spell' },
    { id: 'heal', name: 'Cure Wounds', icon: '💚', level: 1, description: 'Heal a creature' },
    { id: 'shield', name: 'Shield', icon: '🛡️', level: 1, description: 'Protective barrier' },
    { id: 'lightning', name: 'Lightning Bolt', icon: '⚡', level: 3, description: 'Line damage spell' },
    { id: 'invisibility', name: 'Invisibility', icon: '👻', level: 2, description: 'Become invisible' },
    { id: 'teleport', name: 'Teleport', icon: '🌀', level: 7, description: 'Instant transportation' },
  ];

  // Quick abilities
  const quickAbilities = [
    { id: 'strength-save', name: 'Strength Save', icon: '💪', ability: 'STR' },
    { id: 'dexterity-save', name: 'Dexterity Save', icon: '🏃', ability: 'DEX' },
    { id: 'constitution-save', name: 'Constitution Save', icon: '❤️', ability: 'CON' },
    { id: 'intelligence-save', name: 'Intelligence Save', icon: '🧠', ability: 'INT' },
    { id: 'wisdom-save', name: 'Wisdom Save', icon: '👁️', ability: 'WIS' },
    { id: 'charisma-save', name: 'Charisma Save', icon: '✨', ability: 'CHA' },
  ];

  // Quick messages
  const quickMessages = [
    { text: "I attack the nearest enemy!", type: 'emote' },
    { text: "I cast a spell!", type: 'emote' },
    { text: "I use my special ability!", type: 'emote' },
    { text: "I help my ally!", type: 'emote' },
    { text: "I examine the area carefully.", type: 'emote' },
    { text: "I search for hidden clues.", type: 'emote' },
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
                placeholder="1d20+5"
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

          {/* Quick Messages */}
          <div className="space-y-2">
            <Label className="text-xs">Quick Message</Label>
            <div className="flex gap-1">
              <Input
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Type message..."
                className="h-8 text-xs"
              />
              <Button 
                size="sm" 
                onClick={() => {
                  if (customMessage.trim()) {
                    onSendMessage?.(customMessage);
                    setCustomMessage('');
                    toast({
                      title: "Message Sent",
                      description: customMessage,
                    });
                  }
                }}
                className="h-8"
              >
                <MessageSquare className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Roll Buttons */}
        <div className="space-y-2 pt-2 border-t border-border/50">
          <Label className="text-xs">Common Rolls</Label>
          <div className="grid grid-cols-3 gap-1">
            {commonRolls.map((roll) => (
              <Button
                key={roll.formula}
                size="sm"
                variant="outline"
                onClick={() => {
                  setQuickRollValue(roll.formula);
                  handleQuickRoll();
                }}
                className="h-8 text-xs"
                title={roll.name}
              >
                {roll.icon} {roll.formula}
              </Button>
            ))}
          </div>
        </div>
      </SystemWindow>

      {/* Full Player Tools */}
      <SystemWindow title="PLAYER TOOLS">
        <Tabs value={activeTool} onValueChange={setActiveTool} className="w-full">
          <TabsList className="grid w-full grid-cols-4 h-auto">
            <TabsTrigger value="actions" className="flex-col gap-1 p-2">
              <Sword className="w-4 h-4" />
              <span className="text-xs">Actions</span>
            </TabsTrigger>
            <TabsTrigger value="spells" className="flex-col gap-1 p-2">
              <Zap className="w-4 h-4" />
              <span className="text-xs">Spells</span>
            </TabsTrigger>
            <TabsTrigger value="abilities" className="flex-col gap-1 p-2">
              <Shield className="w-4 h-4" />
              <span className="text-xs">Saves</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex-col gap-1 p-2">
              <MessageSquare className="w-4 h-4" />
              <span className="text-xs">Chat</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="actions" className="space-y-4">
            <SystemWindow title="COMBAT ACTIONS" compact>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action) => (
                  <Button
                    key={action.id}
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      onTakeAction?.(action.id);
                      toast({
                        title: "Action Taken",
                        description: action.description,
                      });
                    }}
                    className="h-12 flex-col gap-1 text-xs"
                  >
                    <div className="text-lg">{action.icon}</div>
                    <div>{action.name}</div>
                  </Button>
                ))}
              </div>
            </SystemWindow>

            <SystemWindow title="MOVEMENT" compact>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      onTakeAction?.('move');
                      toast({
                        title: "Move Action",
                        description: "Moving to new position",
                      });
                    }}
                    className="h-12 flex-col gap-1 text-xs"
                  >
                    <Footprints className="w-4 h-4" />
                    Move
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      onTakeAction?.('dash');
                      toast({
                        title: "Dash Action",
                        description: "Taking dash action for extra movement",
                      });
                    }}
                    className="h-12 flex-col gap-1 text-xs"
                  >
                    <Target className="w-4 h-4" />
                    Dash
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      onTakeAction?.('disengage');
                      toast({
                        title: "Disengage",
                        description: "Disengaging from combat",
                      });
                    }}
                    className="h-12 flex-col gap-1 text-xs"
                  >
                    <EyeOff className="w-4 h-4" />
                    Disengage
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      onTakeAction?.('ready');
                      toast({
                        title: "Ready Action",
                        description: "Preparing a ready action",
                      });
                    }}
                    className="h-12 flex-col gap-1 text-xs"
                  >
                    <Eye className="w-4 h-4" />
                    Ready
                  </Button>
                </div>
              </div>
            </SystemWindow>
          </TabsContent>

          <TabsContent value="spells" className="space-y-4">
            <SystemWindow title="QUICK SPELLS" compact>
              <div className="grid grid-cols-2 gap-2">
                {quickSpells.map((spell) => (
                  <Button
                    key={spell.id}
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      onCastSpell?.(spell.id);
                      toast({
                        title: "Spell Cast",
                        description: `${spell.name} cast successfully`,
                      });
                    }}
                    className="h-12 flex-col gap-1 text-xs"
                  >
                    <div className="text-lg">{spell.icon}</div>
                    <div>{spell.name}</div>
                    <Badge variant="outline" className="text-xs">Level {spell.level}</Badge>
                  </Button>
                ))}
              </div>
            </SystemWindow>

            <SystemWindow title="SPELL MANAGEMENT" compact>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Cast Custom Spell</Label>
                  <div className="flex gap-2">
                    <Select value={selectedSpell} onValueChange={setSelectedSpell}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Select spell" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="custom-fireball">Custom Fireball</SelectItem>
                        <SelectItem value="custom-heal">Custom Healing</SelectItem>
                        <SelectItem value="custom-shield">Custom Shield</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button 
                      size="sm" 
                      onClick={() => {
                        if (selectedSpell) {
                          onCastSpell?.(selectedSpell);
                          toast({
                            title: "Spell Cast",
                            description: `${selectedSpell} cast successfully`,
                          });
                        }
                      }}
                      className="h-8"
                    >
                      Cast
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" variant="outline">
                    <BookOpen className="w-3 h-3 mr-1" />
                    Spellbook
                  </Button>
                  <Button size="sm" variant="outline">
                    <Plus className="w-3 h-3 mr-1" />
                    Prepare Spell
                  </Button>
                </div>
              </div>
            </SystemWindow>
          </TabsContent>

          <TabsContent value="abilities" className="space-y-4">
            <SystemWindow title="SAVING THROWS" compact>
              <div className="grid grid-cols-2 gap-2">
                {quickAbilities.map((ability) => (
                  <Button
                    key={ability.id}
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      onUseAbility?.(ability.ability);
                      toast({
                        title: "Saving Throw",
                        description: `${ability.name} roll initiated`,
                      });
                    }}
                    className="h-12 flex-col gap-1 text-xs"
                  >
                    <div className="text-lg">{ability.icon}</div>
                    <div>{ability.name}</div>
                  </Button>
                ))}
              </div>
            </SystemWindow>

            <SystemWindow title="ABILITY CHECKS" compact>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Custom Ability Check</Label>
                  <div className="flex gap-2">
                    <Select value={selectedAbility} onValueChange={setSelectedAbility}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Select ability" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="STR">Strength</SelectItem>
                        <SelectItem value="DEX">Dexterity</SelectItem>
                        <SelectItem value="CON">Constitution</SelectItem>
                        <SelectItem value="INT">Intelligence</SelectItem>
                        <SelectItem value="WIS">Wisdom</SelectItem>
                        <SelectItem value="CHA">Charisma</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button 
                      size="sm" 
                      onClick={() => {
                        if (selectedAbility) {
                          onRollDice?.(`1d20+${selectedAbility}`);
                          toast({
                            title: "Ability Check",
                            description: `${selectedAbility} check rolled`,
                          });
                        }
                      }}
                      className="h-8"
                    >
                      Roll
                    </Button>
                  </div>
                </div>
              </div>
            </SystemWindow>
          </TabsContent>

          <TabsContent value="chat" className="space-y-4">
            <SystemWindow title="QUICK MESSAGES" compact>
              <div className="grid grid-cols-2 gap-2">
                {quickMessages.map((message, index) => (
                  <Button
                    key={index}
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      onSendMessage?.(message.text, message.type);
                      toast({
                        title: "Message Sent",
                        description: message.text,
                      });
                    }}
                    className="h-10 text-xs text-left"
                  >
                    {message.text}
                  </Button>
                ))}
              </div>
            </SystemWindow>

            <SystemWindow title="CUSTOM MESSAGE" compact>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Message Type</Label>
                  <Select defaultValue="say">
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="say">Say</SelectItem>
                      <SelectItem value="emote">Emote</SelectItem>
                      <SelectItem value="whisper">Whisper</SelectItem>
                      <SelectItem value="ooc">Out of Character</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Message</Label>
                  <textarea
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="w-full h-20 p-2 text-xs bg-background border border-border rounded resize-none"
                  />
                </div>
                <Button 
                  onClick={() => {
                    if (customMessage.trim()) {
                      onSendMessage?.(customMessage);
                      setCustomMessage('');
                      toast({
                        title: "Message Sent",
                        description: customMessage,
                      });
                    }
                  }}
                  className="w-full"
                >
                  Send Message
                </Button>
              </div>
            </SystemWindow>
          </TabsContent>
        </Tabs>
      </SystemWindow>
    </div>
  );
};
