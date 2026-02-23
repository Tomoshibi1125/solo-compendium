import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Crown, Lock, CheckCircle, AlertTriangle, User } from 'lucide-react';
import { monarchs } from '@/data/compendium/monarchs';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface RegentUnlockProps {
  characterId: string;
  characterName: string;
  currentRegent?: string;
  onRegentUnlocked?: (regentId: string, level: number) => void;
  className?: string;
}

export function RegentUnlock({
  characterId,
  characterName,
  currentRegent,
  onRegentUnlocked,
  className
}: RegentUnlockProps) {
  const [selectedRegent, setSelectedRegent] = useState('');
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { toast } = useToast();

  const selectedRegentData = monarchs.find(r => r.id === selectedRegent);

  const handleUnlockRegent = async () => {
    if (!selectedRegent || !selectedRegentData) return;

    setIsUnlocking(true);
    try {
      // In a real implementation, this would call an API to unlock the regent
      // For now, we'll simulate the unlock process
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Call the callback to notify parent component
      onRegentUnlocked?.(selectedRegent, selectedLevel);

      toast({
        title: "Regent Unlocked!",
        description: `${characterName} has unlocked the ${selectedRegentData.name} regent at level ${selectedLevel}.`,
      });

      setShowConfirmDialog(false);
      setSelectedRegent('');
      setSelectedLevel(1);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to unlock regent. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUnlocking(false);
    }
  };

  const getRegentStatus = (regentId: string) => {
    if (regentId === currentRegent) {
      return { status: 'unlocked', icon: CheckCircle, color: 'text-green-500', message: 'Currently unlocked' };
    }
    return { status: 'available', icon: Crown, color: 'text-blue-500', message: 'Available for unlock' };
  };

  const getLevelFeatures = (regentId: string, level: number) => {
    const regent = monarchs.find(r => r.id === regentId);
    if (!regent) return [];

    return (regent.class_features ?? [])
      .filter(f => f.level <= level)
      .map(f => ({
        name: f.name,
        description: f.description,
        type: f.type,
        frequency: f.frequency
      }));
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="w-5 h-5" />
          Regent Unlock
        </CardTitle>
        <CardDescription>
          Unlock a regent class overlay for {characterName} after quest completion
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Status */}
        {currentRegent && (
          <div className="p-4 border rounded-lg bg-green-50 border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="font-medium text-green-800">Current Regent</span>
            </div>
            <div className="text-sm text-green-700">
              {monarchs.find(r => r.id === currentRegent)?.name}
            </div>
          </div>
        )}

        {/* Regent Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Select Regent to Unlock</label>
          <Select
            value={selectedRegent}
            onValueChange={setSelectedRegent}
            disabled={!!currentRegent}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a regent to unlock..." />
            </SelectTrigger>
            <SelectContent>
              {monarchs.map((regent) => {
                const status = getRegentStatus(regent.id);
                return (
                  <SelectItem
                    key={regent.id}
                    value={regent.id}
                    disabled={status.status === 'unlocked'}
                  >
                    <div className="flex items-center gap-2">
                      <status.icon className={cn("w-4 h-4", status.color)} />
                      <span>{regent.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {regent.rank}
                      </Badge>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Level Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Starting Level</label>
          <Select
            value={selectedLevel.toString()}
            onValueChange={(value) => setSelectedLevel(parseInt(value))}
            disabled={!selectedRegent}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select starting level..." />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 20 }, (_, i) => i + 1).map((level) => (
                <SelectItem key={level} value={level.toString()}>
                  Level {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Selected Regent Info */}
        {selectedRegentData && (
          <div className="space-y-4">
            <div className="p-4 border rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold">{selectedRegentData.name}</h3>
                <Badge variant="secondary">{selectedRegentData.rank}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {selectedRegentData.description}
              </p>
              
              {/* Requirements */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  <span>Quest completion required</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-blue-500" />
                  <span>DM approval required</span>
                </div>
                {selectedRegentData.multiclass_requirements && (
                  <div className="text-sm text-muted-foreground">
                    Minimum character level: {selectedRegentData.multiclass_requirements.level}
                  </div>
                )}
              </div>
            </div>

            {/* Features at Selected Level */}
            <div className="space-y-3">
              <h4 className="font-medium">Features at Level {selectedLevel}</h4>
              <div className="space-y-2">
                {getLevelFeatures(selectedRegent, selectedLevel).map((feature, index) => (
                  <div key={index} className="p-3 border rounded-lg bg-background">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{feature.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {feature.type}
                      </Badge>
                      {feature.frequency && (
                        <Badge variant="secondary" className="text-xs">
                          {feature.frequency}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                ))}
                {getLevelFeatures(selectedRegent, selectedLevel).length === 0 && (
                  <p className="text-sm text-muted-foreground italic">
                    No features at this level
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Unlock Button */}
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogTrigger asChild>
            <Button
              disabled={!selectedRegent || !!currentRegent}
              className="w-full"
            >
              {currentRegent ? 'Regent Already Unlocked' : 'Unlock Regent'}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Regent Unlock</DialogTitle>
              <DialogDescription>
                Are you sure you want to unlock the {selectedRegentData?.name} regent for {characterName} at level {selectedLevel}?
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-3 border rounded-lg bg-yellow-50 border-yellow-200">
                <div className="flex items-center gap-2 text-sm text-yellow-800">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="font-medium">DM Verification Required</span>
                </div>
                <p className="text-xs text-yellow-700 mt-1">
                  Confirm that the required quest has been completed before unlocking this regent.
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmDialog(false)}
                  disabled={isUnlocking}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUnlockRegent}
                  disabled={isUnlocking}
                >
                  {isUnlocking ? 'Unlocking...' : 'Confirm Unlock'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Instructions */}
        <div className="text-xs text-muted-foreground border-t pt-4">
          <p><strong>DM Instructions:</strong></p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Verify that the player has completed the required quest</li>
            <li>Select the appropriate regent and starting level</li>
            <li>Confirm the unlock to grant the regent abilities</li>
            <li>Regent abilities will progress with character level</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
