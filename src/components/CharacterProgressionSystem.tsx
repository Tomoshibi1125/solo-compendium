import { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Star, 
  Lock, 
  Unlock, 
  Zap, 
  Shield, 
  Sword, 
  Heart, 
  Brain,
  Eye,
  Users,
  Trophy,
  ChevronRight,
  ChevronDown,
  CheckCircle,
  Circle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { type LevelingMode } from '@/lib/campaignSettings';

// Interfaces for character progression
export interface CharacterProgressionSystemProps {
  characterId: string;
  levelingMode?: LevelingMode;
}

export interface SkillNode {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  maxLevel: number;
  currentLevel: number;
  requiredLevel: number;
  prerequisites: string[];
  unlocked: boolean;
  category: 'combat' | 'magic' | 'social' | 'exploration' | 'crafting';
  effects: SkillEffect[];
  cost: {
    skillPoints: number;
    gold?: number;
    experience?: number;
  };
}

export type SkillEffectValue = number | string | `${number}d${number}`;

export interface SkillEffect {
  type: 'stat' | 'ability' | 'passive' | 'active';
  name: string;
  value: SkillEffectValue;
  description: string;
}

export interface SkillTree {
  id: string;
  name: string;
  description: string;
  nodes: SkillNode[];
  connections: Array<{
    from: string;
    to: string;
    type: 'prerequisite' | 'synergy';
  }>;
}

export interface CharacterProgression {
  characterId: string;
  level: number;
  experience: number;
  skillPoints: number;
  gold: number;
  unlockedSkills: string[];
  skillProgress: Record<string, number>;
  stats: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  abilities: string[];
}

// Predefined skill trees
export const COMBAT_SKILL_TREE: SkillTree = {
  id: 'combat',
  name: 'Combat Mastery',
  description: 'Master the art of battle and warfare',
  nodes: [
    {
      id: 'basic-attack',
      name: 'Basic Attack',
      description: 'Fundamental combat techniques',
      icon: <Sword className="w-4 h-4" />,
      maxLevel: 5,
      currentLevel: 0,
      requiredLevel: 1,
      prerequisites: [],
      unlocked: true,
      category: 'combat',
      effects: [
        { type: 'stat', name: 'Attack Bonus', value: 1, description: '+1 to attack rolls' },
        { type: 'ability', name: 'Power Strike', value: '1d6 extra damage', description: 'Deal extra damage on critical hits' }
      ],
      cost: { skillPoints: 1 }
    },
    {
      id: 'weapon-mastery',
      name: 'Weapon Mastery',
      description: 'Advanced weapon techniques',
      icon: <Sword className="w-4 h-4" />,
      maxLevel: 3,
      currentLevel: 0,
      requiredLevel: 3,
      prerequisites: ['basic-attack'],
      unlocked: false,
      category: 'combat',
      effects: [
        { type: 'stat', name: 'Damage Bonus', value: 2, description: '+2 to damage rolls' },
        { type: 'ability', name: 'Weapon Finesse', value: 'Use DEX for attack rolls', description: 'Use dexterity instead of strength for attack rolls' }
      ],
      cost: { skillPoints: 3 }
    },
    {
      id: 'armor-training',
      name: 'Armor Training',
      description: 'Heavy armor and defensive techniques',
      icon: <Shield className="w-4 h-4" />,
      maxLevel: 4,
      currentLevel: 0,
      requiredLevel: 2,
      prerequisites: ['basic-attack'],
      unlocked: false,
      category: 'combat',
      effects: [
        { type: 'stat', name: 'AC Bonus', value: 1, description: '+1 to Armor Class' },
        { type: 'passive', name: 'Heavy Armor Proficiency', value: 'No speed penalty', description: 'No speed penalty for heavy armor' }
      ],
      cost: { skillPoints: 2 }
    },
    {
      id: 'combat-mastery',
      name: 'Combat Mastery',
      description: 'Elite combat techniques and tactics',
      icon: <Trophy className="w-4 h-4" />,
      maxLevel: 5,
      currentLevel: 0,
      requiredLevel: 10,
      prerequisites: ['weapon-mastery', 'armor-training'],
      unlocked: false,
      category: 'combat',
      effects: [
        { type: 'stat', name: 'Critical Hit Range', value: 19, description: 'Critical hits on 19-20' },
        { type: 'ability', name: 'Battle Cry', value: '+2 to all rolls for 1 minute', description: 'Inspire allies with battle cry' }
      ],
      cost: { skillPoints: 5, gold: 1000 }
    }
  ],
  connections: [
    { from: 'basic-attack', to: 'weapon-mastery', type: 'prerequisite' },
    { from: 'basic-attack', to: 'armor-training', type: 'prerequisite' },
    { from: 'weapon-mastery', to: 'combat-mastery', type: 'prerequisite' },
    { from: 'armor-training', to: 'combat-mastery', type: 'prerequisite' }
  ]
};

export const MAGIC_SKILL_TREE: SkillTree = {
  id: 'magic',
  name: 'Arcane Arts',
  description: 'Master the mystical arts and spellcasting',
  nodes: [
    {
      id: 'basic-magic',
      name: 'Basic Magic',
      description: 'Fundamental spellcasting abilities',
      icon: <Zap className="w-4 h-4" />,
      maxLevel: 5,
      currentLevel: 0,
      requiredLevel: 1,
      prerequisites: [],
      unlocked: true,
      category: 'magic',
      effects: [
        { type: 'stat', name: 'Spell Save DC', value: 8, description: 'Base spell save DC' },
        { type: 'ability', name: 'Cantrips', value: '3 cantrips', description: 'Learn 3 cantrip spells' }
      ],
      cost: { skillPoints: 1 }
    },
    {
      id: 'spell-mastery',
      name: 'Spell Mastery',
      description: 'Advanced spellcasting techniques',
      icon: <Brain className="w-4 h-4" />,
      maxLevel: 3,
      currentLevel: 0,
      requiredLevel: 5,
      prerequisites: ['basic-magic'],
      unlocked: false,
      category: 'magic',
      effects: [
        { type: 'stat', name: 'Spell Slots', value: 4, description: '+4 spell slots' },
        { type: 'ability', name: 'Metamagic', value: '1 metamagic feat', description: 'Learn 1 metamagic feat' }
      ],
      cost: { skillPoints: 3 }
    },
    {
      id: 'elemental-magic',
      name: 'Elemental Magic',
      description: 'Control the elements of nature',
      icon: <Eye className="w-4 h-4" />,
      maxLevel: 4,
      currentLevel: 0,
      requiredLevel: 4,
      prerequisites: ['basic-magic'],
      unlocked: false,
      category: 'magic',
      effects: [
        { type: 'stat', name: 'Elemental Damage', value: '1d6', description: '+1d6 elemental damage' },
        { type: 'ability', name: 'Elemental Resistance', value: 'Resistance to one element', description: 'Gain resistance to one element' }
      ],
      cost: { skillPoints: 2 }
    },
    {
      id: 'archmage',
      name: 'Archmage',
      description: 'Master of the arcane arts',
      icon: <Star className="w-4 h-4" />,
      maxLevel: 5,
      currentLevel: 0,
      requiredLevel: 15,
      prerequisites: ['spell-mastery', 'elemental-magic'],
      unlocked: false,
      category: 'magic',
      effects: [
        { type: 'stat', name: 'Spell Power', value: 2, description: '+2 to spell attack rolls' },
        { type: 'ability', name: 'Wish', value: '1 wish spell per year', description: 'Cast wish spell once per year' }
      ],
      cost: { skillPoints: 5, gold: 5000 }
    }
  ],
  connections: [
    { from: 'basic-magic', to: 'spell-mastery', type: 'prerequisite' },
    { from: 'basic-magic', to: 'elemental-magic', type: 'prerequisite' },
    { from: 'spell-mastery', to: 'archmage', type: 'prerequisite' },
    { from: 'elemental-magic', to: 'archmage', type: 'prerequisite' }
  ]
};

export const SOCIAL_SKILL_TREE: SkillTree = {
  id: 'social',
  name: 'Social Influence',
  description: 'Master the art of persuasion and leadership',
  nodes: [
    {
      id: 'persuasion',
      name: 'Persuasion',
      description: 'Basic persuasion and negotiation skills',
      icon: <Users className="w-4 h-4" />,
      maxLevel: 5,
      currentLevel: 0,
      requiredLevel: 1,
      prerequisites: [],
      unlocked: true,
      category: 'social',
      effects: [
        { type: 'stat', name: 'Persuasion Bonus', value: 1, description: '+1 to persuasion checks' },
        { type: 'ability', name: 'Diplomatic Immunity', value: 'Advantage on diplomacy', description: 'Advantage on diplomacy checks' }
      ],
      cost: { skillPoints: 1 }
    },
    {
      id: 'leadership',
      name: 'Leadership',
      description: 'Lead and inspire others',
      icon: <Trophy className="w-4 h-4" />,
      maxLevel: 3,
      currentLevel: 0,
      requiredLevel: 3,
      prerequisites: ['persuasion'],
      unlocked: false,
      category: 'social',
      effects: [
        { type: 'stat', name: 'Leadership Bonus', value: 2, description: '+2 to leadership checks' },
        { type: 'ability', name: 'Inspire Allies', value: '+1 to ally rolls', description: 'Allies get +1 to rolls' }
      ],
      cost: { skillPoints: 3 }
    },
    {
      id: 'intimidation',
      name: 'Intimidation',
      description: 'Command respect through fear',
      icon: <Eye className="w-4 h-4" />,
      maxLevel: 4,
      currentLevel: 0,
      requiredLevel: 2,
      prerequisites: ['persuasion'],
      unlocked: false,
      category: 'social',
      effects: [
        { type: 'stat', name: 'Intimidation Bonus', value: 1, description: '+1 to intimidation checks' },
        { type: 'ability', name: 'Frightful Presence', value: 'Enemies must save', description: 'Enemies must save or be frightened' }
      ],
      cost: { skillPoints: 2 }
    },
    {
      id: 'master-orator',
      name: 'Master Orator',
      description: 'Legendary speaker and influencer',
      icon: <Star className="w-4 h-4" />,
      maxLevel: 5,
      currentLevel: 0,
      requiredLevel: 12,
      prerequisites: ['leadership', 'intimidation'],
      unlocked: false,
      category: 'social',
      effects: [
        { type: 'stat', name: 'All Social Skills', value: 3, description: '+3 to all social skills' },
        { type: 'ability', name: 'Legendary Influence', value: 'Advantage on all social', description: 'Advantage on all social checks' }
      ],
      cost: { skillPoints: 5, gold: 2000 }
    }
  ],
  connections: [
    { from: 'persuasion', to: 'leadership', type: 'prerequisite' },
    { from: 'persuasion', to: 'intimidation', type: 'prerequisite' },
    { from: 'leadership', to: 'master-orator', type: 'prerequisite' },
    { from: 'intimidation', to: 'master-orator', type: 'prerequisite' }
  ]
};

export const ALL_SKILL_TREES = [COMBAT_SKILL_TREE, MAGIC_SKILL_TREE, SOCIAL_SKILL_TREE];

export function useCharacterProgression(
  characterId: string,
  options?: { levelingMode?: LevelingMode }
) {
  const levelingMode = options?.levelingMode ?? 'milestone';
  const isMilestone = levelingMode === 'milestone';
  const [progression, setProgression] = useState<CharacterProgression>({
    characterId,
    level: 1,
    experience: 0,
    skillPoints: 3,
    gold: 100,
    unlockedSkills: ['basic-attack', 'basic-magic', 'persuasion'],
    skillProgress: {},
    stats: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10
    },
    abilities: []
  });

  const canUnlockSkill = useCallback((skill: SkillNode): boolean => {
    // Check if character meets level requirement
    if (progression.level < skill.requiredLevel) {
      return false;
    }

    // Check if prerequisites are met
    const prerequisitesMet = skill.prerequisites.every(prereqId => 
      progression.unlockedSkills.includes(prereqId)
    );

    // Check if character has enough skill points
    const hasEnoughPoints = progression.skillPoints >= skill.cost.skillPoints;

    // Check if character has enough gold (if required)
    const hasEnoughGold = !skill.cost.gold || progression.gold >= skill.cost.gold;

    return prerequisitesMet && hasEnoughPoints && hasEnoughGold;
  }, [progression]);

  const unlockSkill = useCallback((skillId: string) => {
    const skill = ALL_SKILL_TREES.flatMap(tree => tree.nodes).find(node => node.id === skillId);
    if (!skill || !canUnlockSkill(skill)) {
      return false;
    }

    setProgression(prev => ({
      ...prev,
      skillPoints: prev.skillPoints - skill.cost.skillPoints,
      gold: prev.gold - (skill.cost.gold || 0),
      unlockedSkills: [...prev.unlockedSkills, skillId],
      skillProgress: {
        ...prev.skillProgress,
        [skillId]: 1
      }
    }));

    return true;
  }, [canUnlockSkill]);

  const upgradeSkill = useCallback((skillId: string) => {
    const skill = ALL_SKILL_TREES.flatMap(tree => tree.nodes).find(node => node.id === skillId);
    if (!skill || !progression.unlockedSkills.includes(skillId)) {
      return false;
    }

    const currentLevel = progression.skillProgress[skillId] || 0;
    if (currentLevel >= skill.maxLevel) {
      return false;
    }

    const upgradeCost = Math.floor(skill.cost.skillPoints * (1 + currentLevel * 0.5));

    if (progression.skillPoints < upgradeCost) {
      return false;
    }

    setProgression(prev => ({
      ...prev,
      skillPoints: prev.skillPoints - upgradeCost,
      skillProgress: {
        ...prev.skillProgress,
        [skillId]: currentLevel + 1
      }
    }));

    return true;
  }, [progression]);

  const getSkillProgress = useCallback((skillId: string): number => {
    return progression.skillProgress[skillId] || 0;
  }, [progression]);

  const getUnlockedSkills = useCallback((treeId: string): SkillNode[] => {
    const tree = ALL_SKILL_TREES.find(t => t.id === treeId);
    if (!tree) return [];

    return tree.nodes.filter(node => progression.unlockedSkills.includes(node.id));
  }, [progression]);

  const getAvailableSkills = useCallback((treeId: string): SkillNode[] => {
    const tree = ALL_SKILL_TREES.find(t => t.id === treeId);
    if (!tree) return [];

    return tree.nodes.filter(node => 
      !progression.unlockedSkills.includes(node.id) && canUnlockSkill(node)
    );
  }, [progression, canUnlockSkill]);

  const getTotalSkillPoints = useCallback((): number => {
    return progression.level * 3 + progression.skillPoints;
  }, [progression]);

  const getExperienceToNextLevel = useCallback((): number => {
    if (isMilestone) return 0;
    return progression.level * 1000 - progression.experience;
  }, [isMilestone, progression]);

  const addExperience = useCallback((exp: number) => {
    if (isMilestone) return;
    setProgression(prev => {
      const newExperience = prev.experience + exp;
      const expToNextLevel = prev.level * 1000;
      
      if (newExperience >= expToNextLevel) {
        const levelsGained = Math.floor(newExperience / 1000);
        const remainingExp = newExperience % 1000;
        
        return {
          ...prev,
          level: prev.level + levelsGained,
          experience: remainingExp,
          skillPoints: prev.skillPoints + (levelsGained * 3)
        };
      }
      
      return {
        ...prev,
        experience: newExperience
      };
    });
  }, [isMilestone]);

  const canLevelUp = useCallback(() => {
    if (isMilestone) return true;
    const requiredExp = progression.level * 1000;
    return progression.experience >= requiredExp;
  }, [isMilestone, progression]);

  const levelUp = useCallback(() => {
    if (!isMilestone && !canLevelUp()) return false;
    
    setProgression(prev => ({
      ...prev,
      level: prev.level + 1,
      experience: isMilestone ? prev.experience : Math.max(0, prev.experience - (prev.level * 1000)),
      skillPoints: prev.skillPoints + 3,
      stats: {
        ...prev.stats,
        // Add stat increases on level up
        constitution: prev.stats.constitution + 2
      }
    }));
    
    return true;
  }, [canLevelUp, isMilestone]);

  return {
    progression,
    canUnlockSkill,
    unlockSkill,
    upgradeSkill,
    getSkillProgress,
    getUnlockedSkills,
    getAvailableSkills,
    getTotalSkillPoints,
    getExperienceToNextLevel,
    addExperience,
    canLevelUp,
    levelUp
  };
}

// React component for skill tree visualization
export function SkillTreeVisualization({ 
  skillTree, 
  progression, 
  onUnlockSkill, 
  onUpgradeSkill 
}: { 
  skillTree: SkillTree;
  progression: CharacterProgression;
  onUnlockSkill: (skillId: string) => void;
  onUpgradeSkill: (skillId: string) => void;
}) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const getNodePosition = useCallback((nodeId: string, index: number, total: number) => {
    const angle = (index / total) * 2 * Math.PI;
    const radius = 150;
    const x = 50 + radius * Math.cos(angle);
    const y = 50 + radius * Math.sin(angle);
    return { x, y };
  }, []);

  const renderNode = useCallback((node: SkillNode, index: number, total: number) => {
    const position = getNodePosition(node.id, index, total);
    const isUnlocked = progression.unlockedSkills.includes(node.id);
    const currentLevel = progression.skillProgress[node.id] || 0;
    const canUnlock = progression.level >= node.requiredLevel && 
                         node.prerequisites.every(p => progression.unlockedSkills.includes(p)) &&
                         progression.skillPoints >= node.cost.skillPoints;

    return (
      <div
        key={node.id}
        className={cn(
          "skill-node",
          isUnlocked 
            ? "skill-node-unlocked" 
            : canUnlock 
              ? "skill-node-can-unlock" 
              : "skill-node-locked"
        )}
        style={{ 
          '--node-left': `${position.x}%`,
          '--node-top': `${position.y}%`
        } as React.CSSProperties}
        onClick={() => setSelectedNode(node.id)}
      >
        <div className="text-xs text-center">
          <div className="font-semibold">{node.name}</div>
          <div className="text-muted-foreground">
            {isUnlocked ? `Lv ${currentLevel}/${node.maxLevel}` : `Lv ${node.requiredLevel}`}
          </div>
        </div>
        <div className="mt-1">
          {isUnlocked ? (
            <Star className="w-3 h-3 text-blue-500" />
          ) : canUnlock ? (
            <Unlock className="w-3 h-3 text-yellow-500" />
          ) : (
            <Lock className="w-3 h-3 text-gray-400" />
          )}
        </div>
      </div>
    );
  }, [progression, getNodePosition]);

  return (
    <div className="skill-tree-container">
          <div className="skill-tree-center">
            <h3 className="text-lg font-semibold">{skillTree.name}</h3>
            <p className="text-sm text-muted-foreground">{skillTree.description}</p>
          </div>
      
      {skillTree.nodes.map((node, index) => 
        renderNode(node, index, skillTree.nodes.length)
      )}

      {/* Connections */}
      <svg className="absolute inset-0 pointer-events-none">
        {skillTree.connections.map((conn, index) => {
          const fromNode = skillTree.nodes.find(n => n.id === conn.from);
          const toNode = skillTree.nodes.find(n => n.id === conn.to);
          if (!fromNode || !toNode) return null;

          const fromPos = getNodePosition(conn.from, skillTree.nodes.indexOf(fromNode), skillTree.nodes.length);
          const toPos = getNodePosition(conn.to, skillTree.nodes.indexOf(toNode), skillTree.nodes.length);

          return (
            <line
              key={index}
              x1={`${fromPos.x}%`}
              y1={`${fromPos.y}%`}
              x2={`${toPos.x}%`}
              y2={`${toPos.y}%`}
              stroke={conn.type === 'prerequisite' ? '#ef4444' : '#3b82f6'}
              strokeWidth="2"
              strokeDasharray={conn.type === 'prerequisite' ? '5,5' : '0'}
              opacity="0.5"
            />
          );
        })}
      </svg>

      {/* Selected Node Details */}
      {selectedNode && (
        <div className="absolute bottom-4 left-4 right-4 bg-background border rounded-lg p-4">
          {(() => {
            const node = skillTree.nodes.find(n => n.id === selectedNode);
            if (!node) return null;

            const isUnlocked = progression.unlockedSkills.includes(node.id);
            const currentLevel = progression.skillProgress[node.id] || 0;
            const canUnlock = progression.level >= node.requiredLevel && 
                             node.prerequisites.every(p => progression.unlockedSkills.includes(p)) &&
                             progression.skillPoints >= node.cost.skillPoints;

            return (
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{node.name}</h4>
                    <p className="text-sm text-muted-foreground">{node.description}</p>
                  </div>
                  <Badge variant={isUnlocked ? 'default' : canUnlock ? 'secondary' : 'outline'}>
                    {isUnlocked ? 'Unlocked' : canUnlock ? 'Available' : 'Locked'}
                  </Badge>
                </div>

                <div className="text-sm">
                  <div className="flex justify-between">
                    <span>Level: {currentLevel}/{node.maxLevel}</span>
                    <span>Required: Lv {node.requiredLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cost: {node.cost.skillPoints} SP</span>
                    {node.cost.gold && <span>{node.cost.gold} GP</span>}
                  </div>
                </div>

                {node.prerequisites.length > 0 && (
                  <div className="text-sm">
                    <span className="font-medium">Prerequisites: </span>
                    {node.prerequisites.map(p => p).join(', ')}
                  </div>
                )}

                <div className="text-sm">
                  <span className="font-medium">Effects:</span>
                  <ul className="list-disc list-inside ml-2">
                    {node.effects.map((effect, i) => (
                      <li key={i}>{effect.name}: {effect.description}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-2">
                  {!isUnlocked && canUnlock && (
                    <Button
                      size="sm"
                      onClick={() => onUnlockSkill(node.id)}
                    >
                      Unlock ({node.cost.skillPoints} SP)
                    </Button>
                  )}
                  {isUnlocked && currentLevel < node.maxLevel && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onUpgradeSkill(node.id)}
                    >
                      Upgrade ({Math.floor(node.cost.skillPoints * (1 + currentLevel * 0.5))} SP)
                    </Button>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

// Main character progression component
export function CharacterProgressionSystem({ characterId, levelingMode }: CharacterProgressionSystemProps) {
  const [activeTree, setActiveTree] = useState<string>('combat');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [showEquipmentModal, setShowEquipmentModal] = useState(false);

  const {
    progression,
    unlockSkill,
    upgradeSkill,
    getTotalSkillPoints,
    getExperienceToNextLevel,
    addExperience,
    canLevelUp,
    levelUp,
    getUnlockedSkills,
    getAvailableSkills
  } = useCharacterProgression(characterId, { levelingMode });

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Character Progression</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Character Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{progression.level}</div>
              <div className="text-sm text-muted-foreground">Level</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{progression.skillPoints}</div>
              <div className="text-sm text-muted-foreground">Skill Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{progression.gold}</div>
              <div className="text-sm text-muted-foreground">Gold</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{getTotalSkillPoints()}</div>
              <div className="text-sm text-muted-foreground">Total SP</div>
            </div>
          </div>

          {/* Experience Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Experience</span>
              <span>{progression.experience}/{progression.level * 1000}</span>
            </div>
            <Progress value={(progression.experience / (progression.level * 1000)) * 100} />
            <div className="text-xs text-muted-foreground">
              {getExperienceToNextLevel()} XP to next level
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {Object.entries(progression.stats).map(([stat, value]) => (
              <div key={stat} className="text-center">
                <div className="text-lg font-semibold capitalize">{value}</div>
                <div className="text-xs text-muted-foreground">{stat}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Skill Trees */}
      <Card>
        <CardHeader>
          <CardTitle>Skill Trees</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTree} onValueChange={setActiveTree}>
            <TabsList>
              {ALL_SKILL_TREES.map(tree => (
                <TabsTrigger key={tree.id} value={tree.id}>
                  {tree.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {ALL_SKILL_TREES.map(tree => (
              <TabsContent key={tree.id} value={tree.id}>
                <div className="space-y-4">
                  <SkillTreeVisualization
                    skillTree={tree}
                    progression={progression}
                    onUnlockSkill={unlockSkill}
                    onUpgradeSkill={upgradeSkill}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Unlocked Skills</h4>
                      <div className="space-y-2">
                        {getUnlockedSkills(tree.id).map((skill: SkillNode) => (
                          <div key={skill.id} className="flex justify-between items-center p-2 border rounded">
                            <div>
                              <div className="font-medium">{skill.name}</div>
                              <div className="text-sm text-muted-foreground">
                                Level {progression.skillProgress[skill.id] || 0}/{skill.maxLevel}
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => upgradeSkill(skill.id)}
                              disabled={(progression.skillProgress[skill.id] || 0) >= skill.maxLevel}
                            >
                              Upgrade
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Available Skills</h4>
                      <div className="space-y-2">
                        {getAvailableSkills(tree.id).map((skill: SkillNode) => (
                          <div key={skill.id} className="flex justify-between items-center p-2 border rounded">
                            <div>
                              <div className="font-medium">{skill.name}</div>
                              <div className="text-sm text-muted-foreground">
                                Cost: {skill.cost.skillPoints} SP
                                {skill.cost.gold && ` + ${skill.cost.gold} GP`}
                              </div>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => unlockSkill(skill.id)}
                            >
                              Unlock
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
