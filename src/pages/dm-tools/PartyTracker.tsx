import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Heart, Shield } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface PartyMember {
  id: string;
  name: string;
  level: number;
  hp: number;
  maxHp: number;
  ac: number;
  conditions: string[];
  notes: string;
}

const CONDITION_OPTIONS = [
  'Blinded',
  'Charmed',
  'Deafened',
  'Exhaustion',
  'Frightened',
  'Grappled',
  'Incapacitated',
  'Invisible',
  'Paralyzed',
  'Petrified',
  'Poisoned',
  'Prone',
  'Restrained',
  'Stunned',
  'Unconscious',
];

const PartyTracker = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [members, setMembers] = useState<PartyMember[]>([]);
  const [newMember, setNewMember] = useState({
    name: '',
    level: 1,
    hp: 10,
    maxHp: 10,
    ac: 10,
    conditions: [] as string[],
    notes: '',
  });

  const addMember = () => {
    if (!newMember.name) {
      toast({
        title: 'Error',
        description: 'Please enter a name.',
        variant: 'destructive',
      });
      return;
    }

    const member: PartyMember = {
      id: Date.now().toString(),
      ...newMember,
    };

    setMembers([...members, member]);
    setNewMember({
      name: '',
      level: 1,
      hp: 10,
      maxHp: 10,
      ac: 10,
      conditions: [],
      notes: '',
    });

    toast({
      title: 'Added',
      description: 'Party member added.',
    });
  };

  const removeMember = (id: string) => {
    setMembers(members.filter(m => m.id !== id));
  };

  const updateHp = (id: string, delta: number) => {
    setMembers(members.map(m => {
      if (m.id === id) {
        const newHp = Math.max(0, Math.min(m.maxHp, m.hp + delta));
        return { ...m, hp: newHp };
      }
      return m;
    }));
  };

  const toggleCondition = (memberId: string, condition: string) => {
    setMembers(members.map(m => {
      if (m.id === memberId) {
        const hasCondition = m.conditions.includes(condition);
        return {
          ...m,
          conditions: hasCondition
            ? m.conditions.filter(c => c !== condition)
            : [...m.conditions, condition],
        };
      }
      return m;
    }));
  };

  const getHpColor = (hp: number, maxHp: number) => {
    const percentage = (hp / maxHp) * 100;
    if (percentage > 75) return 'text-green-400';
    if (percentage > 50) return 'text-yellow-400';
    if (percentage > 25) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/dm-tools')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Warden Tools
          </Button>
          <h1 className="font-arise text-4xl font-bold mb-2 gradient-text-shadow">
            PARTY TRACKER
          </h1>
          <p className="text-muted-foreground font-heading">
            Track your party's status, HP, conditions, and notes during sessions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {members.length === 0 ? (
              <SystemWindow title="NO PARTY MEMBERS">
                <p className="text-muted-foreground text-center py-8">
                  Add party members to start tracking.
                </p>
              </SystemWindow>
            ) : (
              members.map((member) => (
                <SystemWindow key={member.id} title={member.name}>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">Level {member.level}</Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          AC {member.ac}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMember(member.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="flex items-center gap-2">
                          <Heart className="w-4 h-4" />
                          Hit Points
                        </Label>
                        <span className={cn('font-arise text-lg font-bold', getHpColor(member.hp, member.maxHp))}>
                          {member.hp} / {member.maxHp}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateHp(member.id, -1)}
                        >
                          -1
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateHp(member.id, -5)}
                        >
                          -5
                        </Button>
                        <div className="flex-1 bg-muted rounded h-2 relative overflow-hidden">
                          <div
                            className={cn(
                              'h-full transition-all',
                              getHpColor(member.hp, member.maxHp).replace('text-', 'bg-')
                            )}
                            style={{ width: `${(member.hp / member.maxHp) * 100}%` }}
                          />
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateHp(member.id, 5)}
                        >
                          +5
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateHp(member.id, 1)}
                        >
                          +1
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateHp(member.id, member.maxHp)}
                        >
                          Full
                        </Button>
                      </div>
                    </div>

                    {member.conditions.length > 0 && (
                      <div>
                        <Label className="mb-2 block">Conditions</Label>
                        <div className="flex flex-wrap gap-2">
                          {member.conditions.map((condition) => (
                            <Badge
                              key={condition}
                              variant="destructive"
                              className="cursor-pointer"
                              onClick={() => toggleCondition(member.id, condition)}
                            >
                              {condition} ×
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <Label className="mb-2 block">Add Condition</Label>
                      <div className="flex flex-wrap gap-2">
                        {CONDITION_OPTIONS.filter(c => !member.conditions.includes(c)).map((condition) => (
                          <Badge
                            key={condition}
                            variant="outline"
                            className="cursor-pointer hover:bg-muted"
                            onClick={() => toggleCondition(member.id, condition)}
                          >
                            + {condition}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {member.notes && (
                      <div className="p-3 rounded-lg bg-muted/30 border border-border">
                        <Label className="mb-1 block text-xs">Notes</Label>
                        <p className="text-sm text-muted-foreground">{member.notes}</p>
                      </div>
                    )}
                  </div>
                </SystemWindow>
              ))
            )}
          </div>

          <div className="space-y-6">
            <SystemWindow title="ADD PARTY MEMBER">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    placeholder="Character name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="level">Level</Label>
                    <Input
                      id="level"
                      type="number"
                      value={newMember.level}
                      onChange={(e) => setNewMember({ ...newMember, level: parseInt(e.target.value) || 1 })}
                      min={1}
                      max={20}
                    />
                  </div>
                  <div>
                    <Label htmlFor="ac">AC</Label>
                    <Input
                      id="ac"
                      type="number"
                      value={newMember.ac}
                      onChange={(e) => setNewMember({ ...newMember, ac: parseInt(e.target.value) || 10 })}
                      min={1}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="hp">Current HP</Label>
                    <Input
                      id="hp"
                      type="number"
                      value={newMember.hp}
                      onChange={(e) => setNewMember({ ...newMember, hp: parseInt(e.target.value) || 0 })}
                      min={0}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxHp">Max HP</Label>
                    <Input
                      id="maxHp"
                      type="number"
                      value={newMember.maxHp}
                      onChange={(e) => setNewMember({ ...newMember, maxHp: parseInt(e.target.value) || 1 })}
                      min={1}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Input
                    id="notes"
                    value={newMember.notes}
                    onChange={(e) => setNewMember({ ...newMember, notes: e.target.value })}
                    placeholder="Quick notes..."
                  />
                </div>
                <Button onClick={addMember} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Member
                </Button>
              </div>
            </SystemWindow>

            {members.length > 0 && (
              <SystemWindow title="PARTY SUMMARY" variant="quest">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Members:</span>
                    <span className="font-semibold">{members.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Average Level:</span>
                    <span className="font-semibold">
                      {Math.round(members.reduce((sum, m) => sum + m.level, 0) / members.length)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total HP:</span>
                    <span className="font-semibold">
                      {members.reduce((sum, m) => sum + m.hp, 0)} / {members.reduce((sum, m) => sum + m.maxHp, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Members with Conditions:</span>
                    <span className="font-semibold">
                      {members.filter(m => m.conditions.length > 0).length}
                    </span>
                  </div>
                </div>
              </SystemWindow>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PartyTracker;


