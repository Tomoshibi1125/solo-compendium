import type { ReactNode } from 'react';
import { Award, Crown, Dice6, Shield, Sparkles, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useCharacters } from '@/hooks/useCharacters';
import { useDailyQuests } from '@/hooks/useDailyQuests';
import { useEquipment } from '@/hooks/useEquipment';
import { useRollHistory } from '@/hooks/useRollHistory';
import { useJoinedCampaigns, useMyCampaigns } from '@/hooks/useCampaigns';
import type { DailyQuestInstance } from '@/lib/dailyQuests/types';

type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: ReactNode;
  target: number;
  progress: number;
  category: string;
};

const countCompletedQuests = (instances: DailyQuestInstance[]) =>
  instances.filter((quest) => quest.status === 'completed').length;

export function Achievements({ characterId }: { characterId?: string | null }) {
  const { data: characters = [] } = useCharacters();
  const { data: rollHistory = [] } = useRollHistory(characterId || undefined, 500);
  const { data: myCampaigns = [] } = useMyCampaigns();
  const { data: joinedCampaigns = [] } = useJoinedCampaigns();
  const { equipment = [] } = useEquipment(characterId || '');
  const { instances = [] } = useDailyQuests(characterId || null);

  const achievements: Achievement[] = [
    {
      id: 'first-hunter',
      name: 'First Awakening',
      description: 'Create your first ascendant character.',
      icon: <Star className="w-4 h-4 text-amber-400" />,
      target: 1,
      progress: characters.length,
      category: 'Progression',
    },
    {
      id: 'campaign-ally',
      name: 'Campaign Ally',
      description: 'Join or create a campaign.',
      icon: <Crown className="w-4 h-4 text-purple-400" />,
      target: 1,
      progress: myCampaigns.length + joinedCampaigns.length,
      category: 'Campaigns',
    },
    {
      id: 'dice-roller',
      name: 'Dice Roller',
      description: 'Record 10 dice rolls.',
      icon: <Dice6 className="w-4 h-4 text-blue-400" />,
      target: 10,
      progress: rollHistory.length,
      category: 'Gameplay',
    },
    {
      id: 'daily-discipline',
      name: 'Daily Discipline',
      description: 'Complete 5 daily quests.',
      icon: <Shield className="w-4 h-4 text-green-400" />,
      target: 5,
      progress: countCompletedQuests(instances),
      category: 'Daily Quests',
    },
    {
      id: 'armory-keeper',
      name: 'Armory Keeper',
      description: 'Collect 10 pieces of equipment.',
      icon: <Sparkles className="w-4 h-4 text-pink-400" />,
      target: 10,
      progress: equipment.length,
      category: 'Inventory',
    },
    {
      id: 'quest-master',
      name: 'Quest Master',
      description: 'Complete 20 daily quests.',
      icon: <Award className="w-4 h-4 text-yellow-400" />,
      target: 20,
      progress: countCompletedQuests(instances),
      category: 'Daily Quests',
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Achievement Summary</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">
              {achievements.filter((achievement) => achievement.progress >= achievement.target).length}
            </div>
            <div className="text-sm text-muted-foreground">Unlocked</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{achievements.length}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {Math.round(
                (achievements.filter((achievement) => achievement.progress >= achievement.target).length /
                  Math.max(1, achievements.length)) *
                  100
              )}
              %
            </div>
            <div className="text-sm text-muted-foreground">Completion</div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((achievement) => {
          const isComplete = achievement.progress >= achievement.target;
          const progressPercent = Math.min(100, (achievement.progress / Math.max(1, achievement.target)) * 100);

          return (
            <Card key={achievement.id} className={isComplete ? 'border-primary/50' : 'border-muted'}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-base">
                  <div className="flex items-center gap-2">
                    {achievement.icon}
                    <span>{achievement.name}</span>
                  </div>
                  <Badge variant={isComplete ? 'default' : 'outline'}>
                    {isComplete ? 'Unlocked' : achievement.category}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{achievement.description}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    Progress: {Math.min(achievement.progress, achievement.target)}/{achievement.target}
                  </span>
                  <span>{Math.round(progressPercent)}%</span>
                </div>
                <Progress value={progressPercent} />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
