import { useState } from 'react';
import { Heart, Star, Dice6, Plus, Minus, RotateCcw } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';
import { 
  CharacterResources, 
  calculateTotalTempHP, 
  handleDeathSave, 
  resetDeathSaves,
  applyInspiration,
  gainInspiration,
  addTemporaryHP,
  clearExpiredTempHP
} from '@/lib/characterResources';

interface CharacterResourcesPanelProps {
  resources: CharacterResources;
  onResourcesChange: (resources: CharacterResources) => void;
  hpCurrent: number;
  hpMax: number;
  isDead?: boolean;
}

export function CharacterResourcesPanel({
  resources,
  onResourcesChange,
  hpCurrent,
  hpMax,
  isDead = false
}: CharacterResourcesPanelProps) {
  const { toast } = useToast();
  const [deathSaveDialogOpen, setDeathSaveDialogOpen] = useState(false);
  const [tempHPDialogOpen, setTempHPDialogOpen] = useState(false);
  const [tempHPAmount, setTempHPAmount] = useState('');
  const [tempHPSource, setTempHPSource] = useState('');

  // Clear expired temporary HP
  const cleanedResources = clearExpiredTempHP(resources);
  const totalTempHP = calculateTotalTempHP(cleanedResources);

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
        {totalTempHP > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Heart className="w-5 h-5 text-blue-500" />
                Temporary Hit Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Badge variant="default" className="text-lg px-3 py-1">
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
              {cleanedResources.temp_hp_sources.length > 0 && (
                <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                  {cleanedResources.temp_hp_sources.map((source, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{source.source}</span>
                      <span>+{source.amount}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

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
                        {i < cleanedResources.death_saves.death_save_successes && '✓'}
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
                        {i < cleanedResources.death_saves.death_save_failures && '✗'}
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
    </>
  );
}
