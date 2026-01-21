import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sword, 
  Shield, 
  Heart, 
  Star, 
  Lock, 
  Unlock, 
  Trophy,
  Zap,
  Brain,
  Users,
  Eye,
  ArrowUp,
  Plus,
  Search
} from 'lucide-react';
import { CharacterProgressionSystem, useCharacterProgression } from './CharacterProgressionSystem';
import { type LevelingMode } from '@/lib/campaignSettings';

interface CharacterLevelUpProps {
  characterId: string;
  onLevelUp?: () => void;
  levelingMode?: LevelingMode;
}

export function CharacterLevelUp({ characterId, onLevelUp, levelingMode }: CharacterLevelUpProps) {
  const [showModal, setShowModal] = useState(false);
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [showEquipmentModal, setShowEquipmentModal] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<string>('');
  const [equipmentSearch, setEquipmentSearch] = useState('');
  const mode = levelingMode ?? 'milestone';
  const isMilestone = mode === 'milestone';

  const {
    progression,
    canLevelUp,
    levelUp,
    unlockSkill,
    addExperience
  } = useCharacterProgression(characterId, { levelingMode: mode });
  const canAdvance = isMilestone ? true : canLevelUp();

  const handleLevelUp = () => {
    if (!isMilestone && !canLevelUp()) return;
    levelUp();
    onLevelUp?.();
    setShowModal(false);
  };

  const handleAddExperience = (exp: number) => {
    if (isMilestone) return;
    addExperience(exp);
  };

  const availableSkills = [
    { id: 'athletics', name: 'Athletics', description: 'Physical prowess and endurance', cost: 1 },
    { id: 'acrobatics', name: 'Acrobatics', description: 'Agility and balance', cost: 1 },
    { id: 'stealth', name: 'Stealth', description: 'Moving unnoticed', cost: 1 },
    { id: 'perception', name: 'Perception', description: 'Awareness and observation', cost: 1 },
    { id: 'intimidation', name: 'Intimidation', description: 'Fearsome presence', cost: 1 },
    { id: 'persuasion', name: 'Persuasion', description: 'Influencing others', cost: 1 },
  ];

  const equipment = [
    { id: 'longsword', name: 'Longsword', type: 'weapon', damage: '1d8 slashing' },
    { id: 'shield', name: 'Shield', type: 'armor', ac: '+2' },
    { id: 'leather-armor', name: 'Leather Armor', type: 'armor', ac: '+1' },
    { id: 'bow', name: 'Longbow', type: 'weapon', damage: '1d8 piercing' },
  ];

  const filteredEquipment = equipment.filter(item => 
    item.name.toLowerCase().includes(equipmentSearch.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Level Up Button */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowUp className="w-5 h-5" />
            Character Advancement
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Level {progression.level}</h3>
              {isMilestone ? (
                <p className="text-sm text-muted-foreground">
                  Milestone advancement
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {progression.experience}/{progression.level * 1000} XP
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Button 
                onClick={() => setShowModal(true)}
                disabled={!canAdvance}
                className="w-full"
              >
                <Trophy className="w-4 h-4 mr-2" />
                Level Up
              </Button>
              <div className="text-xs text-muted-foreground text-center">
                {isMilestone
                  ? 'Milestone mode - level up at Warden discretion'
                  : canLevelUp()
                    ? 'Ready to level up!'
                    : `${getExperienceToNextLevel(progression.level)} XP needed`}
              </div>
            </div>
          </div>
          
          {!isMilestone && (
            <Progress value={(progression.experience / (progression.level * 1000)) * 100} />
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Dialog open={showSkillModal} onOpenChange={setShowSkillModal}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Skill
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Skill</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableSkills.map((skill) => (
                  <Card key={skill.id} className="cursor-pointer hover:bg-accent">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{skill.name}</h4>
                          <p className="text-sm text-muted-foreground">{skill.description}</p>
                          <Badge variant="secondary" className="mt-2">
                            {skill.cost} Skill Points
                          </Badge>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => {
                            unlockSkill(skill.id);
                            setShowSkillModal(false);
                          }}
                          disabled={progression.skillPoints < skill.cost}
                        >
                          Add
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showEquipmentModal} onOpenChange={setShowEquipmentModal}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <Sword className="w-4 h-4 mr-2" />
              Add Equipment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Equipment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search equipment..."
                  value={equipmentSearch}
                  onChange={(e) => setEquipmentSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredEquipment.map((item) => (
                  <Card key={item.id} className="cursor-pointer hover:bg-accent">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{item.name}</h4>
                          <p className="text-sm text-muted-foreground capitalize">{item.type}</p>
                          <Badge variant="outline" className="mt-2">
                            {item.type === 'weapon' ? item.damage : `AC ${item.ac}`}
                          </Badge>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => {
                            // Add equipment logic here
                            setShowEquipmentModal(false);
                          }}
                        >
                          Equip
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {!isMilestone && (
          <Button variant="outline" className="w-full" onClick={() => handleAddExperience(500)}>
            <Zap className="w-4 h-4 mr-2" />
            Add 500 XP
          </Button>
        )}
      </div>

      {/* Level Up Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Level Up!</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                Level {progression.level} {'->'} {progression.level + 1}
              </div>
              <p className="text-muted-foreground">
                Congratulations on reaching a new level!
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">Level Up Benefits:</h4>
              <ul className="space-y-1 text-sm">
                <li>- +3 Skill Points</li>
                <li>- +2 Constitution</li>
                <li>- New abilities unlocked</li>
                <li>- Increased health pool</li>
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{progression.skillPoints}</div>
                <div className="text-sm text-muted-foreground">Current SP</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{progression.skillPoints + 3}</div>
                <div className="text-sm text-muted-foreground">After Level Up</div>
              </div>
            </div>

            <Button onClick={handleLevelUp} className="w-full">
              <Trophy className="w-4 h-4 mr-2" />
              Confirm Level Up
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function getExperienceToNextLevel(currentLevel: number): number {
  // SRD 5e experience table - simplified version
  const expTable = [0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000, 85000, 100000, 120000, 140000, 165000, 195000, 225000, 265000, 305000, 355000];
  const nextLevel = Math.min(currentLevel + 1, 20);
  return expTable[nextLevel] - expTable[currentLevel];
}

export default CharacterLevelUp;


