import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Target, 
  Activity, 
  Clock,
  Award,
  Zap,
  Shield,
  Sword
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { logger } from '@/lib/logger';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { listLocalCharacters, listLocalRollHistory } from '@/lib/guestStore';

interface CampaignAnalytics {
  campaignId: string;
  totalSessions: number;
  totalPlaytime: number;
  averageSessionDuration: number;
  playerEngagement: PlayerEngagement[];
  combatStats: CombatStatistics;
  progressionMetrics: ProgressionMetrics;
  diceRollAnalytics: DiceRollAnalytics;
  timeDistribution: TimeDistribution[];
}

interface PlayerEngagement {
  playerId: string;
  playerName: string;
  sessionsAttended: number;
  totalPlaytime: number;
  averageEngagement: number;
  characterLevel: number;
  rollsCount: number;
  contributions: number;
}

interface CombatStatistics {
  totalCombats: number;
  averageCombatDuration: number;
  playerKOs: number;
  enemyKOs: number;
  criticalHits: number;
  misses: number;
  damageDealt: number;
  damageTaken: number;
  mostUsedAbilities: Array<{ name: string; count: number }>;
}

interface ProgressionMetrics {
  levelsGained: number;
  itemsAcquired: number;
  goldEarned: number;
  questsCompleted: number;
  experiencePoints: number;
  skillProgress: Array<{ skill: string; progress: number }>;
}

interface DiceRollAnalytics {
  totalRolls: number;
  averageRoll: number;
  criticalSuccesses: number;
  criticalFailures: number;
  mostRolled: Array<{ formula: string; count: number }>;
  luckiestPlayer: { playerId: string; average: number };
  unluckiestPlayer: { playerId: string; average: number };
}

interface TimeDistribution {
  hour: number;
  sessions: number;
  averageDuration: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8DD1E1', '#D084D0'];

type TimeRange = 'week' | 'month' | 'all';

type RollRecord = Database['public']['Tables']['roll_history']['Row'];

type CampaignMemberRow = {
  user_id: string;
  character_id: string | null;
  role: string;
  joined_at: string;
  characters: { id: string; name: string; level: number; job: string } | null;
};

type CampaignNoteRow = {
  id: string;
  category: string | null;
  created_at: string;
  updated_at: string;
  user_id?: string;
};

type CampaignMessageRow = {
  id: string;
  user_id: string;
  created_at: string;
};

type LocalSession = {
  id: string;
  title: string;
  date?: string;
};

type CampaignDataSet = {
  members: CampaignMemberRow[];
  notes: CampaignNoteRow[];
  messages: CampaignMessageRow[];
  rolls: RollRecord[];
};

const DAY_MS = 24 * 60 * 60 * 1000;
const isE2E = import.meta.env.VITE_E2E === 'true';

const getRangeStart = (range: TimeRange): Date | null => {
  if (range === 'week') return new Date(Date.now() - 7 * DAY_MS);
  if (range === 'month') return new Date(Date.now() - 30 * DAY_MS);
  return null;
};

const isWithinRange = (dateString: string, rangeStart: Date | null): boolean => {
  if (!rangeStart) return true;
  return new Date(dateString).getTime() >= rangeStart.getTime();
};

const parseLocalSessions = (): LocalSession[] => {
  if (typeof window === 'undefined') return [];
  const raw = window.localStorage.getItem('dm-sessions');
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as LocalSession[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const localSessionsToNotes = (sessions: LocalSession[]): CampaignNoteRow[] => {
  const now = new Date().toISOString();
  return sessions.map((session) => ({
    id: session.id,
    category: 'session',
    created_at: session.date ? new Date(session.date).toISOString() : now,
    updated_at: session.date ? new Date(session.date).toISOString() : now,
  }));
};

const buildAnalytics = (
  campaignId: string,
  timeRange: TimeRange,
  data: CampaignDataSet
): CampaignAnalytics => {
  const rangeStart = getRangeStart(timeRange);
  const notes = data.notes.filter((note) => isWithinRange(note.created_at, rangeStart));
  const messages = data.messages.filter((msg) => isWithinRange(msg.created_at, rangeStart));
  const rolls = data.rolls.filter((roll) => isWithinRange(roll.created_at, rangeStart));

  const sessionNotes = notes.filter((note) => (note.category || '').toLowerCase() === 'session');
  const questNotes = notes.filter((note) => (note.category || '').toLowerCase() === 'quest');
  const totalSessions = sessionNotes.length;
  const totalPlaytime = 0;
  const averageSessionDuration = totalSessions > 0 ? totalPlaytime / totalSessions : 0;

  const rollsByUser = new Map<string, RollRecord[]>();
  for (const roll of rolls) {
    const key = roll.user_id;
    const list = rollsByUser.get(key) || [];
    list.push(roll);
    rollsByUser.set(key, list);
  }

  const messagesByUser = new Map<string, number>();
  for (const msg of messages) {
    messagesByUser.set(msg.user_id, (messagesByUser.get(msg.user_id) || 0) + 1);
  }

  const members = data.members.length > 0
    ? data.members
    : Array.from(rollsByUser.keys()).map((userId) => ({
        user_id: userId,
        character_id: null,
        role: 'hunter',
        joined_at: new Date().toISOString(),
        characters: null,
      }));

  const rollCounts = members.map((member) => (rollsByUser.get(member.user_id) || []).length);
  const maxRolls = Math.max(0, ...rollCounts);

  const playerEngagement = members.map((member) => {
    const memberRolls = rollsByUser.get(member.user_id) || [];
    const uniqueDates = new Set(memberRolls.map((roll) => roll.created_at.split('T')[0]));
    const characterName = member.characters?.name || `Player ${member.user_id.slice(0, 6)}`;
    const characterLevel = member.characters?.level ?? 1;
    const engagementScore = maxRolls > 0 ? Math.round((memberRolls.length / maxRolls) * 100) : 0;

    return {
      playerId: member.user_id,
      playerName: characterName,
      sessionsAttended: uniqueDates.size,
      totalPlaytime: uniqueDates.size * averageSessionDuration,
      averageEngagement: engagementScore,
      characterLevel,
      rollsCount: memberRolls.length,
      contributions: messagesByUser.get(member.user_id) || 0,
    };
  });

  const totalRolls = rolls.length;
  const rollTotal = rolls.reduce((sum, roll) => sum + roll.result, 0);
  const averageRoll = totalRolls > 0 ? rollTotal / totalRolls : 0;
  const criticalSuccesses = rolls.filter((roll) => roll.rolls.includes(20)).length;
  const criticalFailures = rolls.filter((roll) => roll.rolls.includes(1)).length;

  const formulaCounts = new Map<string, number>();
  for (const roll of rolls) {
    formulaCounts.set(roll.dice_formula, (formulaCounts.get(roll.dice_formula) || 0) + 1);
  }

  const mostRolled = Array.from(formulaCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([formula, count]) => ({ formula, count }));

  const averagesByUser = playerEngagement.map((player) => {
    const memberRolls = rollsByUser.get(player.playerId) || [];
    const memberAverage =
      memberRolls.length > 0
        ? memberRolls.reduce((sum, roll) => sum + roll.result, 0) / memberRolls.length
        : 0;
    return { playerId: player.playerId, average: memberAverage };
  });

  const luckiestPlayer = averagesByUser.reduce(
    (best, current) => (current.average > best.average ? current : best),
    averagesByUser[0] || { playerId: '', average: 0 }
  );
  const unluckiestPlayer = averagesByUser.reduce(
    (worst, current) => (current.average < worst.average ? current : worst),
    averagesByUser[0] || { playerId: '', average: 0 }
  );

  const combatRolls = rolls.filter((roll) =>
    /attack|damage|combat/i.test(`${roll.roll_type} ${roll.context || ''}`)
  );
  const combatCriticals = combatRolls.filter((roll) => roll.rolls.includes(20)).length;
  const combatMisses = combatRolls.filter((roll) => roll.rolls.includes(1)).length;

  const abilityCounts = new Map<string, number>();
  for (const roll of combatRolls) {
    if (!roll.context) continue;
    abilityCounts.set(roll.context, (abilityCounts.get(roll.context) || 0) + 1);
  }
  const mostUsedAbilities = Array.from(abilityCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));

  const skillProgress = playerEngagement.map((player) => ({
    skill: player.playerName,
    progress: player.averageEngagement,
  }));

  const timeBuckets = new Map<number, { sessions: number; totalDuration: number }>();
  const timeSources = rolls.length > 0 ? rolls.map((roll) => roll.created_at) : sessionNotes.map((note) => note.created_at);
  for (const timestamp of timeSources) {
    const hour = new Date(timestamp).getHours();
    const entry = timeBuckets.get(hour) || { sessions: 0, totalDuration: 0 };
    entry.sessions += 1;
    timeBuckets.set(hour, entry);
  }

  const timeDistribution = Array.from(timeBuckets.entries())
    .map(([hour, entry]) => ({
      hour,
      sessions: entry.sessions,
      averageDuration: entry.sessions > 0 ? entry.totalDuration / entry.sessions : 0,
    }))
    .sort((a, b) => a.hour - b.hour);

  const levelsGained = playerEngagement.reduce((sum, player) => sum + Math.max(0, player.characterLevel - 1), 0);

  return {
    campaignId,
    totalSessions,
    totalPlaytime,
    averageSessionDuration,
    playerEngagement,
    combatStats: {
      totalCombats: combatRolls.length,
      averageCombatDuration: 0,
      playerKOs: 0,
      enemyKOs: 0,
      criticalHits: combatCriticals,
      misses: combatMisses,
      damageDealt: 0,
      damageTaken: 0,
      mostUsedAbilities,
    },
    progressionMetrics: {
      levelsGained,
      itemsAcquired: 0,
      goldEarned: 0,
      questsCompleted: questNotes.length,
      experiencePoints: 0,
      skillProgress,
    },
    diceRollAnalytics: {
      totalRolls,
      averageRoll,
      criticalSuccesses,
      criticalFailures,
      mostRolled,
      luckiestPlayer,
      unluckiestPlayer,
    },
    timeDistribution,
  };
};

const fetchCampaignData = async (campaignId: string, timeRange: TimeRange): Promise<CampaignDataSet> => {
  if (!isSupabaseConfigured || isE2E) {
    const localCharacters = listLocalCharacters();
    const members: CampaignMemberRow[] = localCharacters.map((character) => ({
      user_id: character.user_id || 'guest',
      character_id: character.id,
      role: 'hunter',
      joined_at: character.created_at,
      characters: {
        id: character.id,
        name: character.name,
        level: character.level ?? 1,
        job: character.job ?? 'Unknown',
      },
    }));

    const sessions = parseLocalSessions();
    return {
      members,
      notes: localSessionsToNotes(sessions),
      messages: [],
      rolls: listLocalRollHistory(),
    };
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { members: [], notes: [], messages: [], rolls: [] };
  }

  const rangeStart = getRangeStart(timeRange);
  const rangeIso = rangeStart ? rangeStart.toISOString() : null;

  const membersQuery = supabase
    .from('campaign_members')
    .select('user_id, character_id, role, joined_at, characters (id, name, level, job)')
    .eq('campaign_id', campaignId);

  const notesQuery = supabase
    .from('campaign_notes')
    .select('id, category, created_at, updated_at, user_id')
    .eq('campaign_id', campaignId);

  const messagesQuery = supabase
    .from('campaign_messages')
    .select('id, user_id, created_at')
    .eq('campaign_id', campaignId);

  const rollsQuery = supabase
    .from('roll_history')
    .select('*')
    .eq('campaign_id', campaignId);

  if (rangeIso) {
    notesQuery.gte('created_at', rangeIso);
    messagesQuery.gte('created_at', rangeIso);
    rollsQuery.gte('created_at', rangeIso);
  }

  const [membersResult, notesResult, messagesResult, rollsResult] = await Promise.all([
    membersQuery,
    notesQuery,
    messagesQuery,
    rollsQuery,
  ]);

  if (membersResult.error) throw membersResult.error;
  if (notesResult.error) throw notesResult.error;
  if (messagesResult.error) throw messagesResult.error;
  if (rollsResult.error) throw rollsResult.error;

  return {
    members: (membersResult.data || []) as CampaignMemberRow[],
    notes: (notesResult.data || []) as CampaignNoteRow[],
    messages: (messagesResult.data || []) as CampaignMessageRow[],
    rolls: (rollsResult.data || []) as RollRecord[],
  };
};

export function useCampaignAnalytics(campaignId: string) {
  const [analytics, setAnalytics] = useState<CampaignAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>('month');

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchCampaignData(campaignId, timeRange);
      setAnalytics(buildAnalytics(campaignId, timeRange, data));
    } catch (error) {
      logger.error('Failed to fetch analytics:', error);
      setAnalytics(buildAnalytics(campaignId, timeRange, { members: [], notes: [], messages: [], rolls: [] }));
    } finally {
      setLoading(false);
    }
  }, [campaignId, timeRange]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return { analytics, loading, timeRange, setTimeRange, refetch: fetchAnalytics };
}

export function CampaignAnalyticsDashboard({ campaignId }: { campaignId: string }) {
  const { analytics, loading, timeRange, setTimeRange } = useCampaignAnalytics(campaignId);

  if (loading || !analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Activity className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  const engagementData = analytics.playerEngagement.map(player => ({
    name: player.playerName,
    engagement: player.averageEngagement,
    sessions: player.sessionsAttended,
    rolls: player.rollsCount,
  }));

  const combatData = [
    { name: 'Player KOs', value: analytics.combatStats.playerKOs },
    { name: 'Enemy KOs', value: analytics.combatStats.enemyKOs },
    { name: 'Critical Hits', value: analytics.combatStats.criticalHits },
    { name: 'Misses', value: analytics.combatStats.misses },
  ];

  const progressionData = analytics.progressionMetrics.skillProgress.map(skill => ({
    name: skill.skill,
    progress: skill.progress,
  }));

  const timeData = analytics.timeDistribution
    .filter(d => d.sessions > 0)
    .map(d => ({
      hour: `${d.hour}:00`,
      sessions: d.sessions,
    }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Campaign Analytics</h2>
          <p className="text-muted-foreground">Detailed insights for your campaign</p>
        </div>
        <Tabs value={timeRange} onValueChange={(value) => setTimeRange(value as 'week' | 'month' | 'all')}>
          <TabsList>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="all">All Time</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalSessions}</div>
            <p className="text-xs text-muted-foreground">
              {Math.floor(analytics.averageSessionDuration / 60)} min avg session
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Playtime</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.floor(analytics.totalPlaytime / (60 * 60 * 1000))}h
            </div>
            <p className="text-xs text-muted-foreground">
              Across all players
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Combat Encounters</CardTitle>
            <Sword className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.combatStats.totalCombats}</div>
            <p className="text-xs text-muted-foreground">
              {Math.floor(analytics.combatStats.averageCombatDuration)} min avg
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dice Rolls</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.diceRollAnalytics.totalRolls}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.diceRollAnalytics.averageRoll.toFixed(1)} avg roll
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="engagement" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="engagement">Player Engagement</TabsTrigger>
          <TabsTrigger value="combat">Combat Analysis</TabsTrigger>
          <TabsTrigger value="progression">Progression</TabsTrigger>
          <TabsTrigger value="dice">Dice Statistics</TabsTrigger>
          <TabsTrigger value="timing">Session Timing</TabsTrigger>
        </TabsList>

        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Player Engagement Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="engagement" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Player Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {analytics.playerEngagement.map((player) => (
                  <div key={player.playerId} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">{player.playerName}</h4>
                      <p className="text-sm text-muted-foreground">
                        Level {player.characterLevel} - {player.rollsCount} rolls
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{player.averageEngagement}%</div>
                      <Progress value={player.averageEngagement} className="w-20" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="combat" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Combat Outcomes</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={combatData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${percent ? `${(percent * 100).toFixed(0)}%` : '0%'}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {combatData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Combat Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {analytics.combatStats.enemyKOs}
                    </div>
                    <p className="text-sm text-muted-foreground">Enemies Defeated</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {analytics.combatStats.playerKOs}
                    </div>
                    <p className="text-sm text-muted-foreground">Player KOs</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {analytics.combatStats.criticalHits}
                    </div>
                    <p className="text-sm text-muted-foreground">Critical Hits</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-600">
                      {analytics.combatStats.misses}
                    </div>
                    <p className="text-sm text-muted-foreground">Misses</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Most Used Abilities</h4>
                  <div className="space-y-2">
                    {analytics.combatStats.mostUsedAbilities.map((ability, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm">{ability.name}</span>
                        <Badge variant="secondary">{ability.count}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="progression" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Skill Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {progressionData.map((skill) => (
                  <div key={skill.name} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{skill.name}</span>
                      <span className="text-sm text-muted-foreground">{skill.progress}%</span>
                    </div>
                    <Progress value={skill.progress} className="w-full" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Progression Milestones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {analytics.progressionMetrics.levelsGained}
                    </div>
                    <p className="text-sm text-muted-foreground">Levels Gained</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {analytics.progressionMetrics.itemsAcquired}
                    </div>
                    <p className="text-sm text-muted-foreground">Items Acquired</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {analytics.progressionMetrics.goldEarned}
                    </div>
                    <p className="text-sm text-muted-foreground">Gold Earned</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {analytics.progressionMetrics.questsCompleted}
                    </div>
                    <p className="text-sm text-muted-foreground">Quests Completed</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-600">
                      {analytics.progressionMetrics.experiencePoints.toLocaleString()}
                    </div>
                    <p className="text-sm text-muted-foreground">Total Experience Points</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="dice" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Most Rolled Formulas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {analytics.diceRollAnalytics.mostRolled.map((roll, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <code className="text-sm bg-muted px-2 py-1 rounded">{roll.formula}</code>
                    <Badge variant="outline">{roll.count} rolls</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Luck Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {analytics.diceRollAnalytics.criticalSuccesses}
                    </div>
                    <p className="text-sm text-muted-foreground">Critical Successes</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {analytics.diceRollAnalytics.criticalFailures}
                    </div>
                    <p className="text-sm text-muted-foreground">Critical Failures</p>
                  </div>
                </div>

                <div className="pt-4 border-t space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Luckiest Player</span>
                    <Badge className="bg-green-100 text-green-800">
                      {analytics.playerEngagement.find(p => p.playerId === analytics.diceRollAnalytics.luckiestPlayer.playerId)?.playerName}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Unluckiest Player</span>
                    <Badge className="bg-red-100 text-red-800">
                      {analytics.playerEngagement.find(p => p.playerId === analytics.diceRollAnalytics.unluckiestPlayer.playerId)?.playerName}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="timing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Session Distribution by Hour</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={timeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="sessions" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

