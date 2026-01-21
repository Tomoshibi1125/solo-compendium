import { useState } from 'react';
import { Heart, Star, Dice6, Plus, Minus, RotateCcw, Pencil, Trash2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  CharacterResources, 
  calculateTotalTempHP, 
  handleDeathSave, 
  resetDeathSaves,
  applyInspiration,
  gainInspiration,
  addTemporaryHP,
  clearExpiredTempHP,
  type CustomResource,
  type ResourceRecharge
} from '@/lib/characterResources';

const RECHARGE_OPTIONS: Array<{ value: ResourceRecharge; label: string }> = [
  { value: 'none', label: 'None' },
  { value: 'short-rest', label: 'Short Rest' },
  { value: 'long-rest', label: 'Long Rest' },
  { value: 'encounter', label: 'Encounter' },
  { value: 'daily', label: 'Daily' },
];

interface CharacterResourcesPanelProps {
  resources: CharacterResources;
  onResourcesChange: (resources: CharacterResources) => void;
  onResourceRoll?: (resource: CustomResource) => void;
  hpCurrent: number;
  hpMax: number;
  isDead?: boolean;
}

export function CharacterResourcesPanel({
  resources,
  onResourcesChange,
  onResourceRoll,
  hpCurrent,
  hpMax,
  isDead = false
}: CharacterResourcesPanelProps) {
  const { toast } = useToast();
  const [deathSaveDialogOpen, setDeathSaveDialogOpen] = useState(false);
  const [tempHPDialogOpen, setTempHPDialogOpen] = useState(false);
  const [tempHPAmount, setTempHPAmount] = useState('');
  const [tempHPSource, setTempHPSource] = useState('');
  const [resourceDialogOpen, setResourceDialogOpen] = useState(false);
  const [resourceEditingId, setResourceEditingId] = useState<string | null>(null);
  const [resourceDraft, setResourceDraft] = useState({
    name: '',
    current: '',
    max: '',
    dieSize: '',
    recharge: 'long-rest' as ResourceRecharge,
    notes: '',
  });

  // Clear expired temporary HP
  const cleanedResources = clearExpiredTempHP(resources);
  const totalTempHP = calculateTotalTempHP(cleanedResources);
  const customResources = cleanedResources.custom_resources || [];
  const clampNumber = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

  const handleDeathSaveClick = (success: boolean) => {
    const { updated, outcome } = handleDeathSave(cleanedResources, success);
    onResourcesChange(updated);

    switch (outcome) {
      case 'stable':
        toast({
          title: 'Stabilized!',
          description: 'Three successful death saves. Character is now stable.',
        });
        break;
      case 'dead':
        toast({
          title: 'Character Died',
          description: 'Three failed death saves. Character has died.',
          variant: 'destructive',
        });
        break;
      case 'critical':
        toast({
          title: 'Critical Success!',
          description: 'Natural 20 on death save - character stabilizes with 1 HP.',
        });
        break;
      default:
        toast({
          title: success ? 'Death Save Success' : 'Death Save Failure',
          description: `${success ? cleanedResources.death_saves.death_save_successes + 1 : cleanedResources.death_saves.death_save_successes} successes, ${cleanedResources.death_saves.death_save_failures} failures`,
        });
    }

    setDeathSaveDialogOpen(false);
  };

  const handleResetDeathSaves = () => {
    onResourcesChange(resetDeathSaves(cleanedResources));
    toast({
      title: 'Death Saves Reset',
      description: 'Death saves have been reset.',
    });
  };

  const handleUseInspiration = () => {
    if (cleanedResources.inspiration.inspiration_points > 0 && !cleanedResources.inspiration.inspiration_used) {
      onResourcesChange(applyInspiration(cleanedResources));
      toast({
        title: 'Inspiration Used',
        description: 'You may add this inspiration to any ability check, attack roll, or saving throw.',
      });
    }
  };

  const handleGainInspiration = () => {
    onResourcesChange(gainInspiration(cleanedResources));
    toast({
      title: 'Inspiration Gained',
      description: 'You have gained 1 inspiration point.',
    });
  };

  const handleAddTempHP = () => {
    const amount = parseInt(tempHPAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid positive number.',
        variant: 'destructive',
      });
      return;
    }

    if (!tempHPSource.trim()) {
      toast({
        title: 'Source Required',
        description: 'Please specify the source of temporary HP.',
        variant: 'destructive',
      });
      return;
    }

    const updated = addTemporaryHP(cleanedResources, amount, tempHPSource.trim());
    onResourcesChange(updated);
    
    setTempHPAmount('');
    setTempHPSource('');
    setTempHPDialogOpen(false);
    
    toast({
      title: 'Temporary HP Added',
      description: `+${amount} temporary HP from ${tempHPSource}`,
    });
  };

  const resetResourceDraft = () => {
    setResourceDraft({
      name: '',
      current: '',
      max: '',
      dieSize: '',
      recharge: 'long-rest',
      notes: '',
    });
  };

  const openAddResource = () => {
    setResourceEditingId(null);
    resetResourceDraft();
    setResourceDialogOpen(true);
  };

  const openEditResource = (resource: CustomResource) => {
    setResourceEditingId(resource.id);
    setResourceDraft({
      name: resource.name,
      current: resource.current.toString(),
      max: resource.max.toString(),
      dieSize: resource.dieSize ? resource.dieSize.toString() : '',
      recharge: resource.recharge || 'none',
      notes: resource.notes || '',
    });
    setResourceDialogOpen(true);
  };

  const handleSaveResource = () => {
    const name = resourceDraft.name.trim();
    if (!name) {
      toast({
        title: 'Name required',
        description: 'Enter a resource name.',
        variant: 'destructive',
      });
      return;
    }

    const max = Number.parseInt(resourceDraft.max, 10);
    if (!Number.isFinite(max) || max <= 0) {
      toast({
        title: 'Invalid max value',
        description: 'Max must be a positive number.',
        variant: 'destructive',
      });
      return;
    }

    const currentRaw = Number.parseInt(resourceDraft.current, 10);
    const current = Number.isFinite(currentRaw) ? clampNumber(currentRaw, 0, max) : max;
    const dieSizeRaw = Number.parseInt(resourceDraft.dieSize, 10);
    const dieSize = Number.isFinite(dieSizeRaw) && dieSizeRaw > 0 ? dieSizeRaw : undefined;
    const notes = resourceDraft.notes.trim();

    const nextResource: CustomResource = {
      id: resourceEditingId || `resource-${Date.now()}`,
      name,
      current,
      max,
      dieSize,
      recharge: resourceDraft.recharge || 'none',
      notes: notes || undefined,
    };

    const nextResources = resourceEditingId
      ? customResources.map((resource) => (resource.id === resourceEditingId ? nextResource : resource))
      : [...customResources, nextResource];

    onResourcesChange({ ...cleanedResources, custom_resources: nextResources });
    setResourceDialogOpen(false);
    setResourceEditingId(null);
    resetResourceDraft();
    toast({
      title: resourceEditingId ? 'Resource Updated' : 'Resource Added',
      description: `${name} is ready.`,
    });
  };

  const handleDeleteResource = (resourceId: string) => {
    const resource = customResources.find((entry) => entry.id === resourceId);
    const nextResources = customResources.filter((entry) => entry.id !== resourceId);
    onResourcesChange({ ...cleanedResources, custom_resources: nextResources });
    toast({
      title: 'Resource Removed',
      description: resource ? `${resource.name} removed.` : 'Resource removed.',
    });
  };

  const handleAdjustResource = (resourceId: string, delta: number) => {
    const nextResources = customResources.map((resource) => {
      if (resource.id !== resourceId) return resource;
      const nextCurrent = clampNumber(resource.current + delta, 0, resource.max);
      return { ...resource, current: nextCurrent };
    });
    onResourcesChange({ ...cleanedResources, custom_resources: nextResources });
  };

  const handleResetResource = (resourceId: string) => {
    const nextResources = customResources.map((resource) => (
      resource.id === resourceId ? { ...resource, current: resource.max } : resource
    ));
    onResourcesChange({ ...cleanedResources, custom_resources: nextResources });
  };

  const formatRecharge = (recharge: ResourceRecharge | undefined) => {
    const resolved = recharge || 'none';
    const match = RECHARGE_OPTIONS.find((option) => option.value === resolved);
    return match ? match.label : 'None';
  };

  const showDeathSaves = hpCurrent <= 0 && !isDead;

  return (
    <>
      <div className="space-y-4">
        {/* Inspiration */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Inspiration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant={cleanedResources.inspiration.inspiration_points > 0 ? "default" : "secondary"}>
                  {cleanedResources.inspiration.inspiration_points} points
                </Badge>
                {cleanedResources.inspiration.inspiration_used && (
                  <Badge variant="outline">Used this turn</Badge>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleUseInspiration}
                  disabled={cleanedResources.inspiration.inspiration_points === 0 || cleanedResources.inspiration.inspiration_used}
                >
                  Use
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleGainInspiration}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Temporary HP */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Heart className="w-5 h-5 text-blue-500" />
              Temporary Hit Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Badge
                variant={totalTempHP > 0 ? "default" : "secondary"}
                className="text-lg px-3 py-1"
              >
                +{totalTempHP}
              </Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setTempHPDialogOpen(true)}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
            {cleanedResources.temp_hp_sources.length > 0 ? (
              <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                {cleanedResources.temp_hp_sources.map((source, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{source.source}</span>
                    <span>+{source.amount}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-3 text-xs text-muted-foreground">
                No temporary HP recorded.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resource Trackers */}
        <Card>
          <CardHeader className="pb-3 flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              Resource Trackers
            </CardTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={openAddResource}
              className="h-7 px-2 text-xs"
              data-testid="resource-trackers-add"
            >
              <Plus className="w-3 h-3 mr-1" />
              Add
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {customResources.length === 0 ? (
              <div className="text-xs text-muted-foreground">
                No custom resources yet.
              </div>
            ) : (
              customResources.map((resource) => (
                <div key={resource.id} className="space-y-2 rounded-lg border border-border bg-muted/20 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-heading text-sm font-semibold">{resource.name}</span>
                        {resource.recharge && resource.recharge !== 'none' && (
                          <Badge variant="outline" className="text-xs">
                            {formatRecharge(resource.recharge)}
                          </Badge>
                        )}
                        {resource.dieSize && (
                          <Badge variant="secondary" className="text-xs">
                            d{resource.dieSize}
                          </Badge>
                        )}
                      </div>
                      {resource.notes && (
                        <p className="text-xs text-muted-foreground">{resource.notes}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleAdjustResource(resource.id, -1)}
                        disabled={resource.current <= 0}
                        aria-label={`Spend ${resource.name}`}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="min-w-[3.25rem] text-center text-sm font-heading">
                        {resource.current}/{resource.max}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleAdjustResource(resource.id, 1)}
                        disabled={resource.current >= resource.max}
                        aria-label={`Recover ${resource.name}`}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {resource.dieSize && onResourceRoll && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => onResourceRoll(resource)}
                      >
                        <Dice6 className="w-3 h-3" />
                        Roll
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1"
                      onClick={() => handleResetResource(resource.id)}
                    >
                      <RotateCcw className="w-3 h-3" />
                      Reset
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditResource(resource)}
                      aria-label={`Edit ${resource.name}`}
                    >
                      <Pencil className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteResource(resource.id)}
                      aria-label={`Delete ${resource.name}`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Death Saves */}
        {showDeathSaves && (
          <Card className="border-red-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-red-600">
                <Dice6 className="w-5 h-5" />
                Death Saves
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Successes</Label>
                  <div className="flex gap-1 mt-1">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={`success-${i}`}
                        className={`w-8 h-8 rounded border-2 flex items-center justify-center text-sm font-bold ${
                          i < cleanedResources.death_saves.death_save_successes
                            ? 'bg-green-500 border-green-600 text-white'
                            : 'bg-gray-100 border-gray-300'
                        }`}
                      >
                        {i < cleanedResources.death_saves.death_save_successes && 'S'}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Failures</Label>
                  <div className="flex gap-1 mt-1">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={`failure-${i}`}
                        className={`w-8 h-8 rounded border-2 flex items-center justify-center text-sm font-bold ${
                          i < cleanedResources.death_saves.death_save_failures
                            ? 'bg-red-500 border-red-600 text-white'
                            : 'bg-gray-100 border-gray-300'
                        }`}
                      >
                        {i < cleanedResources.death_saves.death_save_failures && 'F'}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="default"
                  className="flex-1"
                  onClick={() => handleDeathSaveClick(true)}
                  disabled={cleanedResources.death_saves.death_save_successes >= 3}
                >
                  Success
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleDeathSaveClick(false)}
                  disabled={cleanedResources.death_saves.death_save_failures >= 3}
                >
                  Failure
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleResetDeathSaves}
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add Temporary HP Dialog */}
      <Dialog open={tempHPDialogOpen} onOpenChange={setTempHPDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Temporary Hit Points</DialogTitle>
            <DialogDescription>
              Add temporary hit points from a spell, feature, or other source.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="temp-hp-amount">Amount</Label>
              <Input
                id="temp-hp-amount"
                type="number"
                placeholder="Enter amount"
                value={tempHPAmount}
                onChange={(e) => setTempHPAmount(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="temp-hp-source">Source</Label>
              <Input
                id="temp-hp-source"
                placeholder="e.g., Aid spell, False Life"
                value={tempHPSource}
                onChange={(e) => setTempHPSource(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTempHPDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTempHP}>
              Add Temp HP
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Resource Dialog */}
      <Dialog open={resourceDialogOpen} onOpenChange={setResourceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{resourceEditingId ? 'Edit Resource' : 'Add Resource'}</DialogTitle>
            <DialogDescription>
              Track class resources, limited-use features, or custom pools.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="resource-name">Name</Label>
              <Input
                id="resource-name"
                placeholder="Resource name"
                value={resourceDraft.name}
                onChange={(e) => setResourceDraft({ ...resourceDraft, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="resource-max">Max</Label>
                <Input
                  id="resource-max"
                  type="number"
                  placeholder="Max"
                  value={resourceDraft.max}
                  onChange={(e) => setResourceDraft({ ...resourceDraft, max: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="resource-current">Current</Label>
                <Input
                  id="resource-current"
                  type="number"
                  placeholder="Current"
                  value={resourceDraft.current}
                  onChange={(e) => setResourceDraft({ ...resourceDraft, current: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="resource-die">Die Size (optional)</Label>
                <Input
                  id="resource-die"
                  type="number"
                  placeholder="6"
                  value={resourceDraft.dieSize}
                  onChange={(e) => setResourceDraft({ ...resourceDraft, dieSize: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="resource-recharge">Recharge</Label>
                <Select
                  value={resourceDraft.recharge}
                  onValueChange={(value) =>
                    setResourceDraft({ ...resourceDraft, recharge: value as ResourceRecharge })
                  }
                >
                  <SelectTrigger id="resource-recharge" className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RECHARGE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="resource-notes">Notes</Label>
              <Input
                id="resource-notes"
                placeholder="Optional notes"
                value={resourceDraft.notes}
                onChange={(e) => setResourceDraft({ ...resourceDraft, notes: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResourceDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveResource}>
              {resourceEditingId ? 'Save Changes' : 'Add Resource'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
