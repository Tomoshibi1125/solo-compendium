import { useState, useRef } from 'react';
import { Download, Upload, Trash2, History, Save, FileJson } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useCharacterBackups, type CharacterBackup, importBackupFromFile, restoreFromBackup } from '@/hooks/useCharacterBackup';
import { useUpdateCharacter } from '@/hooks/useCharacters';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface CharacterBackupManagerProps {
  characterId: string;
  character: any; // CharacterWithAbilities
}

export function CharacterBackupManager({ characterId, character }: CharacterBackupManagerProps) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [backupName, setBackupName] = useState('');
  const [restoreTarget, setRestoreTarget] = useState<CharacterBackup | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CharacterBackup | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { backups, createBackup, deleteBackup, exportBackup, isLoading } = useCharacterBackups(characterId);
  const updateCharacter = useUpdateCharacter();

  const handleCreateBackup = async () => {
    if (!character) return;
    
    try {
      await createBackup({ character, backupName: backupName.trim() || undefined });
      setBackupName('');
      setCreateDialogOpen(false);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleRestore = async () => {
    if (!restoreTarget || !character) return;

    try {
      const restoredData = restoreFromBackup(restoreTarget);
      
      await updateCharacter.mutateAsync({
        id: characterId,
        data: {
          name: restoredData.name,
          level: restoredData.level,
          hp_current: restoredData.hp_current,
          hp_max: restoredData.hp_max,
          hp_temp: restoredData.hp_temp || 0,
          notes: restoredData.notes,
          appearance: restoredData.appearance,
          backstory: restoredData.backstory,
        },
      });

      toast({
        title: 'Character restored',
        description: `Restored from backup: ${restoreTarget.backup_name || 'Unnamed backup'}`,
      });
      setRestoreTarget(null);
    } catch (error) {
      toast({
        title: 'Failed to restore',
        description: 'Could not restore character from backup.',
        variant: 'destructive',
      });
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const backup = await importBackupFromFile(file);
      
      // Save imported backup to localStorage
      const key = `character-backup-${characterId}`;
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.unshift(backup);
      localStorage.setItem(key, JSON.stringify(existing.slice(0, 10)));

      toast({
        title: 'Backup imported',
        description: 'Backup file imported successfully.',
      });
    } catch (error) {
      toast({
        title: 'Import failed',
        description: 'Could not import backup file. Please check the file format.',
        variant: 'destructive',
      });
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading font-semibold flex items-center gap-2">
              <History className="w-4 h-4" />
              Backups
            </h3>
            <p className="text-sm text-muted-foreground">
              {backups.length} backup{backups.length !== 1 ? 's' : ''} available
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Save className="w-4 h-4" />
                  Create Backup
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Backup</DialogTitle>
                  <DialogDescription>
                    Save a snapshot of your character's current state.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="backup-name">Backup Name (optional)</Label>
                    <Input
                      id="backup-name"
                      value={backupName}
                      onChange={(e) => setBackupName(e.target.value)}
                      placeholder="e.g., Before Level Up"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateBackup} disabled={isLoading}>
                    Create Backup
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4" />
              Import
            </Button>
          </div>
        </div>

        <ScrollArea className="h-[300px]">
          {backups.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <History className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
              <p className="text-muted-foreground">No backups yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Create a backup to restore your character later
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {backups.map((backup) => (
                <div
                  key={backup.id}
                  className="p-3 rounded-lg border bg-muted/30 flex items-center justify-between gap-2"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">
                        {backup.backup_name || 'Unnamed Backup'}
                      </span>
                      {backup.backup_name?.toLowerCase().includes('auto') && (
                        <Badge variant="secondary" className="text-xs">Auto</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(backup.created_at), { addSuffix: true })}
                      {' • '}
                      Level {backup.backup_data.level}
                      {' • '}
                      {backup.backup_data.hp_current}/{backup.backup_data.hp_max} HP
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => exportBackup(backup)}
                      title="Export backup"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setRestoreTarget(backup)}
                      title="Restore from backup"
                    >
                      <History className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => setDeleteTarget(backup)}
                      title="Delete backup"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Restore Confirmation */}
      <AlertDialog open={!!restoreTarget} onOpenChange={(open) => !open && setRestoreTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore from Backup?</AlertDialogTitle>
            <AlertDialogDescription>
              This will restore your character to the state saved in "{restoreTarget?.backup_name || 'this backup'}".
              Current changes will be overwritten. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRestore}>
              Restore
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Backup?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteTarget?.backup_name || 'this backup'}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (deleteTarget) {
                  await deleteBackup(deleteTarget.id);
                  setDeleteTarget(null);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

