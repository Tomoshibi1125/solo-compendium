import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  Heart, 
  Shield, 
  Swords,
  Crown,
  X,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ShadowSoldier {
  id: string;
  name: string;
  rank: string;
  tier: number;
  cr: string;
  shadow_energy?: number;
  max_summoned?: number;
  hit_points_average: number;
  is_named: boolean;
  is_elite: boolean;
}

interface ShadowArmyMember {
  id: string;
  shadow_soldier_id: string;
  instance_name?: string;
  hp_current?: number;
  hp_max?: number;
  is_active: boolean;
  is_dismissed: boolean;
  summoned_at: string;
  shadow_soldier?: ShadowSoldier;
}

interface ShadowArmyManagerProps {
  characterId: string;
  characterLevel: number;
  shadowEnergyCurrent: number;
  shadowEnergyMax: number;
  onShadowEnergyChange?: (current: number, max: number) => void;
}

export function ShadowArmyManager({
  characterId,
  characterLevel,
  shadowEnergyCurrent,
  shadowEnergyMax,
  onShadowEnergyChange,
}: ShadowArmyManagerProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [summonDialogOpen, setSummonDialogOpen] = useState(false);
  const [selectedShadow, setSelectedShadow] = useState<string>('');
  const [instanceName, setInstanceName] = useState('');

  // Fetch available shadow soldiers
  const { data: availableShadows = [] } = useQuery({
    queryKey: ['shadow-soldiers-available'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('compendium_shadow_soldiers')
        .select('*')
        .order('tier', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      return data as ShadowSoldier[];
    },
  });

  // Fetch character's shadow army
  const { data: shadowArmy = [], isLoading } = useQuery({
    queryKey: ['shadow-army', characterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('character_shadow_army')
        .select(`
          *,
          shadow_soldier:compendium_shadow_soldiers(*)
        `)
        .eq('character_id', characterId)
        .order('summoned_at', { ascending: false });

      if (error) throw error;
      return (data || []) as ShadowArmyMember[];
    },
  });

  const activeShadows = shadowArmy.filter(s => s.is_active && !s.is_dismissed);
  const dismissedShadows = shadowArmy.filter(s => s.is_dismissed);

  // Summon shadow mutation
  const summonShadow = useMutation({
    mutationFn: async ({ shadowId, name }: { shadowId: string; name?: string }) => {
      const shadow = availableShadows.find(s => s.id === shadowId);
      if (!shadow) throw new Error('Shadow not found');

      // Check shadow energy
      if (shadow.shadow_energy && shadowEnergyCurrent < shadow.shadow_energy) {
        throw new Error(`Insufficient shadow energy. Need ${shadow.shadow_energy}, have ${shadowEnergyCurrent}.`);
      }

      // Check max summoned
      const activeCount = activeShadows.filter(s => s.shadow_soldier_id === shadowId).length;
      if (shadow.max_summoned && activeCount >= shadow.max_summoned) {
        throw new Error(`Maximum ${shadow.max_summoned} of ${shadow.name} can be summoned.`);
      }

      const { data, error } = await supabase
        .from('character_shadow_army')
        .insert({
          character_id: characterId,
          shadow_soldier_id: shadowId,
          instance_name: name || null,
          hp_current: shadow.hit_points_average,
          hp_max: shadow.hit_points_average,
          is_active: true,
        })
        .select(`
          *,
          shadow_soldier:compendium_shadow_soldiers(*)
        `)
        .single();

      if (error) throw error;

      // Deduct shadow energy
      if (shadow.shadow_energy && onShadowEnergyChange) {
        const newCurrent = Math.max(0, shadowEnergyCurrent - shadow.shadow_energy);
        onShadowEnergyChange(newCurrent, shadowEnergyMax);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['shadow-army', characterId]);
      setSummonDialogOpen(false);
      setSelectedShadow('');
      setInstanceName('');
      toast({
        title: 'Shadow Summoned',
        description: 'Your shadow soldier has been summoned.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Summoning Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Dismiss shadow mutation
  const dismissShadow = useMutation({
    mutationFn: async (armyId: string) => {
      const { error } = await supabase
        .from('character_shadow_army')
        .update({
          is_active: false,
          is_dismissed: true,
          dismissed_at: new Date().toISOString(),
        })
        .eq('id', armyId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['shadow-army', characterId]);
      toast({
        title: 'Shadow Dismissed',
        description: 'Your shadow soldier has been dismissed.',
      });
    },
  });

  // Update shadow HP mutation
  const updateShadowHP = useMutation({
    mutationFn: async ({ armyId, hp }: { armyId: string; hp: number }) => {
      const { error } = await supabase
        .from('character_shadow_army')
        .update({ hp_current: Math.max(0, hp) })
        .eq('id', armyId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['shadow-army', characterId]);
    },
  });

  const handleSummon = () => {
    if (!selectedShadow) {
      toast({
        title: 'Select a Shadow',
        description: 'Please select a shadow soldier to summon.',
        variant: 'destructive',
      });
      return;
    }
    summonShadow.mutate({ shadowId: selectedShadow, name: instanceName || undefined });
  };

  const getTierColor = (tier: number) => {
    const colors: Record<number, string> = {
      1: 'bg-gray-600',
      2: 'bg-blue-600',
      3: 'bg-purple-600',
      4: 'bg-orange-600',
      5: 'bg-red-600',
    };
    return colors[tier] || 'bg-gray-600';
  };

  return (
    <div className="space-y-4">
      {/* Shadow Energy Display */}
      <SystemWindow title="SHADOW ENERGY" className="border-purple-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <div>
              <div className="font-display text-2xl">
                {shadowEnergyCurrent}/{shadowEnergyMax}
              </div>
              <div className="text-xs text-muted-foreground">
                Shadow Energy Available
              </div>
            </div>
          </div>
          <Dialog open={summonDialogOpen} onOpenChange={setSummonDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-purple-500/50 text-purple-400">
                <Plus className="w-4 h-4 mr-2" />
                Summon Shadow
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Summon Shadow Soldier</DialogTitle>
                <DialogDescription>
                  Select a shadow soldier from your army to summon. Shadow energy will be consumed.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label>Shadow Soldier</Label>
                  <Select value={selectedShadow} onValueChange={setSelectedShadow}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a shadow soldier..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableShadows.map((shadow) => (
                        <SelectItem key={shadow.id} value={shadow.id}>
                          <div className="flex items-center gap-2">
                            <span>{shadow.name}</span>
                            <Badge className={`${getTierColor(shadow.tier)} text-white text-xs`}>
                              Tier {shadow.tier}
                            </Badge>
                            {shadow.shadow_energy && (
                              <span className="text-xs text-muted-foreground">
                                ({shadow.shadow_energy} SE)
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {selectedShadow && (
                  <>
                    {availableShadows.find(s => s.id === selectedShadow)?.shadow_energy && (
                      <div className="p-3 bg-purple-950/30 border border-purple-500/30 rounded">
                        <div className="text-sm text-muted-foreground">
                          <strong>Shadow Energy Cost:</strong>{' '}
                          {availableShadows.find(s => s.id === selectedShadow)?.shadow_energy}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <strong>Available:</strong> {shadowEnergyCurrent}
                        </div>
                        {(() => {
                          const selected = availableShadows.find(s => s.id === selectedShadow);
                          return selected && selected.shadow_energy > shadowEnergyCurrent;
                        })() && (
                          <div className="text-sm text-red-400 mt-2">
                            ⚠️ Insufficient shadow energy
                          </div>
                        )}
                      </div>
                    )}
                    <div>
                      <Label>Instance Name (Optional)</Label>
                      <Input
                        value={instanceName}
                        onChange={(e) => setInstanceName(e.target.value)}
                        placeholder="e.g., Igris Alpha, Shadow Guard #1"
                      />
                    </div>
                  </>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSummonDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSummon}
                  disabled={!selectedShadow || summonShadow.isPending}
                  className="border-purple-500/50 text-purple-400"
                >
                  {summonShadow.isPending ? 'Summoning...' : 'Summon'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </SystemWindow>

      {/* Active Shadows */}
      {activeShadows.length > 0 && (
        <SystemWindow title="ACTIVE SHADOWS" className="border-purple-500/30">
          <div className="space-y-3">
            {activeShadows.map((member) => {
              const shadow = member.shadow_soldier as ShadowSoldier | undefined;
              if (!shadow) return null;

              return (
                <div
                  key={member.id}
                  className="p-3 rounded border bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-heading font-semibold">
                          {member.instance_name || shadow.name}
                        </h4>
                        {shadow.is_named && (
                          <Crown className="w-4 h-4 text-purple-400" />
                        )}
                        <Badge className={`${getTierColor(shadow.tier)} text-white text-xs`}>
                          Tier {shadow.tier}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {shadow.rank}
                        </Badge>
                        <Link
                          to={`/compendium/shadow-soldiers/${shadow.id}`}
                          className="text-xs text-primary hover:underline flex items-center gap-1"
                        >
                          View Stats
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4 text-red-400" />
                          <span>
                            {member.hp_current ?? shadow.hit_points_average}/
                            {member.hp_max ?? shadow.hit_points_average} HP
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Shield className="w-4 h-4 text-blue-400" />
                          <span>CR {shadow.cr}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={member.hp_current ?? shadow.hit_points_average}
                        onChange={(e) => {
                          const newHP = parseInt(e.target.value) || 0;
                          updateShadowHP.mutate({ armyId: member.id, hp: newHP });
                        }}
                        className="w-20 h-8 text-sm"
                        min={0}
                        max={member.hp_max ?? shadow.hit_points_average}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => dismissShadow.mutate(member.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </SystemWindow>
      )}

      {/* Dismissed Shadows */}
      {dismissedShadows.length > 0 && (
        <SystemWindow title="DISMISSED SHADOWS" variant="alert">
          <div className="space-y-2">
            {dismissedShadows.map((member) => {
              const shadow = member.shadow_soldier as ShadowSoldier | undefined;
              if (!shadow) return null;

              return (
                <div
                  key={member.id}
                  className="p-2 rounded border bg-muted/20 opacity-60"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm">
                      {member.instance_name || shadow.name} (Dismissed)
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => dismissShadow.mutate(member.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </SystemWindow>
      )}

      {activeShadows.length === 0 && dismissedShadows.length === 0 && (
        <SystemWindow title="SHADOW ARMY" variant="alert">
          <p className="text-muted-foreground text-center py-4">
            No shadows summoned. Use Shadow Energy to summon shadow soldiers to your army.
          </p>
        </SystemWindow>
      )}
    </div>
  );
}

