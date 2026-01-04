import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Copy, Target, Clock, Users, AlertTriangle } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const QUEST_TYPES = [
  'Gate Clearance',
  'Rescue Mission',
  'Investigation',
  'Defense',
  'Extermination',
  'Retrieval',
  'Escort',
  'Reconnaissance',
  'Assassination',
  'Delivery',
] as const;

const QUEST_LOCATIONS = [
  'Urban Gate',
  'Forest Gate',
  'Underground Gate',
  'Sky Gate',
  'Abyssal Gate',
  'Shadow Gate',
  'Elemental Gate',
  'Beast Gate',
  'Construct Gate',
  'Necromantic Gate',
  'Celestial Gate',
  'Dimensional Rift',
] as const;

const QUEST_COMPLICATIONS = [
  'Time limit: Must complete within X hours',
  'Multiple Gates: Series of connected Gates',
  'Environmental hazard: Extreme weather or terrain',
  'Rival hunters: Competing teams want the reward',
  'Hidden objective: True goal is different from stated',
  'Betrayal: NPC contact is untrustworthy',
  'Escalation: Situation worsens during mission',
  'Information blackout: Limited communication',
  'Political interference: Hunter Association politics',
  'Monarch involvement: Shadow Monarch fragments detected',
] as const;

const QUEST_REWARDS = [
  'Standard Gate rewards',
  'Bonus gold payment',
  'Rare material access',
  'Hunter Association favor',
  'Relic fragment',
  'Exclusive information',
  'Guild recommendation',
  'Special equipment',
  'System favor bonus',
  'Supreme Deity blessing',
] as const;

const QUEST_RANKS = ['E', 'D', 'C', 'B', 'A', 'S'] as const;

interface GeneratedQuest {
  type: string;
  title: string;
  rank: string;
  location: string;
  description: string;
  objectives: string[];
  complications: string[];
  rewards: string[];
  timeLimit?: string;
}

function generateQuest(rank?: string): GeneratedQuest {
  const selectedRank = rank || QUEST_RANKS[Math.floor(Math.random() * QUEST_RANKS.length)];
  const type = QUEST_TYPES[Math.floor(Math.random() * QUEST_TYPES.length)];
  const location = QUEST_LOCATIONS[Math.floor(Math.random() * QUEST_LOCATIONS.length)];
  
  // Generate title
  const title = `${type} at ${location}`;
  
  // Generate description based on type
  const descriptions: Record<string, string> = {
    'Gate Clearance': `Clear the ${location} and eliminate all threats. The Hunter Association has marked this Gate for immediate clearance.`,
    'Rescue Mission': `A group of civilians/hunters are trapped within the ${location}. Extract them safely before it's too late.`,
    'Investigation': `Strange activity detected in the ${location}. Investigate the source and report findings to the Hunter Association.`,
    'Defense': `Defend a location from an incoming Gate breach. Hold the line until reinforcements arrive.`,
    'Extermination': `Eliminate a specific threat within the ${location}. Target is particularly dangerous and must be destroyed.`,
    'Retrieval': `Recover a valuable item or artifact from within the ${location}. Item is critical and must not be damaged.`,
    'Escort': `Escort an important individual through the ${location}. Protect them at all costs.`,
    'Reconnaissance': `Gather intelligence about the ${location}. Avoid combat if possible; stealth is key.`,
    'Assassination': `Eliminate a specific high-value target within the ${location}. Mission is classified and off the books.`,
    'Delivery': `Deliver supplies or information through dangerous territory to the ${location}. Time-sensitive cargo.`,
  };
  
  const description = descriptions[type] || `Complete the ${type} mission at ${location}.`;
  
  // Generate objectives (2-4 objectives)
  const numObjectives = 2 + Math.floor(Math.random() * 3);
  const objectives: string[] = [];
  objectives.push(`Reach the ${location}`);
  
  switch (type) {
    case 'Gate Clearance':
      objectives.push('Eliminate all monsters', 'Clear the Gate boss', 'Secure the Gate core');
      break;
    case 'Rescue Mission':
      objectives.push('Locate trapped individuals', 'Extract survivors', 'Ensure no one is left behind');
      break;
    case 'Investigation':
      objectives.push('Explore the Gate', 'Gather evidence', 'Identify the threat level');
      break;
    case 'Defense':
      objectives.push('Set up defensive positions', 'Hold for specified duration', 'Protect key infrastructure');
      break;
    case 'Extermination':
      objectives.push('Track the target', 'Engage and eliminate', 'Confirm elimination');
      break;
    case 'Retrieval':
      objectives.push('Locate the item', 'Secure the item', 'Extract safely');
      break;
    case 'Escort':
      objectives.push('Meet the client', 'Navigate safely through Gate', 'Deliver to destination');
      break;
    case 'Reconnaissance':
      objectives.push('Enter undetected', 'Map the area', 'Gather intelligence', 'Extract without alerting enemies');
      break;
    case 'Assassination':
      objectives.push('Identify target location', 'Eliminate target', 'Cover tracks');
      break;
    case 'Delivery':
      objectives.push('Collect cargo', 'Navigate route', 'Deliver to destination');
      break;
  }
  
  // Generate complications (0-2 complications)
  const numComplications = Math.floor(Math.random() * 3);
  const complications: string[] = [];
  const shuffled = [...QUEST_COMPLICATIONS].sort(() => Math.random() - 0.5);
  for (let i = 0; i < numComplications && i < shuffled.length; i++) {
    complications.push(shuffled[i]);
  }
  
  // Generate rewards (1-3 rewards)
  const numRewards = 1 + Math.floor(Math.random() * 3);
  const rewards: string[] = [];
  const shuffledRewards = [...QUEST_REWARDS].sort(() => Math.random() - 0.5);
  for (let i = 0; i < numRewards && i < shuffledRewards.length; i++) {
    rewards.push(shuffledRewards[i]);
  }
  
  // Time limit for some quests
  const timeLimit = Math.random() < 0.4 ? `${4 + Math.floor(Math.random() * 20)} hours` : undefined;
  
  return {
    type,
    title,
    rank: selectedRank,
    location,
    description,
    objectives: objectives.slice(0, numObjectives),
    complications,
    rewards,
    timeLimit,
  };
}

const QuestGenerator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedRank, setSelectedRank] = useState<string>('C');
  const [quest, setQuest] = useState<GeneratedQuest | null>(null);

  const handleGenerate = () => {
    const result = generateQuest(selectedRank);
    setQuest(result);
  };

  const handleCopy = () => {
    if (!quest) return;
    const text = `QUEST: ${quest.title}
Rank: ${quest.rank}
Location: ${quest.location}

${quest.description}

OBJECTIVES:
${quest.objectives.map((obj, i) => `${i + 1}. ${obj}`).join('\n')}

${quest.complications.length > 0 ? `COMPLICATIONS:\n${quest.complications.map((c) => `- ${c}`).join('\n')}\n` : ''}${quest.timeLimit ? `TIME LIMIT: ${quest.timeLimit}\n` : ''}REWARDS:
${quest.rewards.map((r) => `- ${r}`).join('\n')}`;
    
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: 'Quest details copied to clipboard.',
    });
  };

  const getRankColor = (rank: string) => {
    const colors: Record<string, string> = {
      E: 'text-green-400 border-green-400/30 bg-green-400/10',
      D: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
      C: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
      B: 'text-orange-400 border-orange-400/30 bg-orange-400/10',
      A: 'text-red-400 border-red-400/30 bg-red-400/10',
      S: 'text-purple-400 border-purple-400/30 bg-purple-400/10',
    };
    return colors[rank] || colors.C;
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/dm-tools')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to DM Tools
          </Button>
          <h1 className="font-arise text-4xl font-bold mb-2 gradient-text-shadow">
            QUEST GENERATOR
          </h1>
          <p className="text-muted-foreground font-heading">
            Generate missions and contracts for Hunters. Create diverse quests with objectives, complications, and rewards.
          </p>
        </div>

        <SystemWindow title="GENERATE QUEST" className="mb-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="rank" className="mb-2 block">
                Quest Rank (Optional - Random if not selected)
              </Label>
              <Select value={selectedRank} onValueChange={setSelectedRank}>
                <SelectTrigger id="rank">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="random">Random</SelectItem>
                  {QUEST_RANKS.map((rank) => (
                    <SelectItem key={rank} value={rank}>
                      Rank {rank}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleGenerate}
              className="w-full btn-shadow-monarch"
              size="lg"
            >
              <Target className="w-4 h-4 mr-2" />
              Generate Quest
            </Button>
          </div>
        </SystemWindow>

        {quest && (
          <SystemWindow title={quest.title} className="mb-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                <Badge className={cn('text-lg px-4 py-2', getRankColor(quest.rank))}>
                  Rank {quest.rank}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {quest.location}
                </Badge>
                {quest.timeLimit && (
                  <Badge variant="outline" className="flex items-center gap-1 text-orange-400 border-orange-400/30">
                    <Clock className="w-3 h-3" />
                    {quest.timeLimit}
                  </Badge>
                )}
              </div>

              <div className="pt-2 border-t border-border">
                <p className="text-muted-foreground font-heading leading-relaxed mb-4">
                  {quest.description}
                </p>

                <div className="space-y-3">
                  <div>
                    <h3 className="font-heading font-semibold mb-2 flex items-center gap-2">
                      <Target className="w-4 h-4 text-primary" />
                      Objectives
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {quest.objectives.map((objective, idx) => (
                        <li key={idx}>{objective}</li>
                      ))}
                    </ul>
                  </div>

                  {quest.complications.length > 0 && (
                    <div>
                      <h3 className="font-heading font-semibold mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-400" />
                        Complications
                      </h3>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {quest.complications.map((complication, idx) => (
                          <li key={idx}>{complication}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div>
                    <h3 className="font-heading font-semibold mb-2 flex items-center gap-2">
                      <Badge className="text-amber-400 border-amber-400/30 bg-amber-400/10">
                        Rewards
                      </Badge>
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {quest.rewards.map((reward, idx) => (
                        <li key={idx}>{reward}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-border">
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  className="flex-1"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Quest
                </Button>
                <Button
                  onClick={handleGenerate}
                  variant="outline"
                  className="flex-1"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate
                </Button>
              </div>
            </div>
          </SystemWindow>
        )}
      </div>
    </Layout>
  );
};

export default QuestGenerator;

