import { Trash2, TrendingUp, Moon, Sun, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { bulkDeleteCharacters, bulkLevelUp, bulkRest } from '@/lib/bulkOperations';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { logger } from '@/lib/logger';

interface BulkActionsBarProps {
  selectedIds: string[];
  onClearSelection: () => void;
}

export function BulkActionsBar({ selectedIds, onClearSelection }: BulkActionsBarProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLevelingUp, setIsLevelingUp] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const handleBulkDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await bulkDeleteCharacters(selectedIds);
      if (result.failed > 0) {
        toast({
          title: 'Partial success',
          description: `Deleted ${result.success} characters. ${result.failed} failed.`,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Characters deleted',
          description: `Successfully deleted ${result.success} character${result.success > 1 ? 's' : ''}.`,
        });
      }
      queryClient.invalidateQueries({ queryKey: ['characters'] });
      onClearSelection();
      setDeleteConfirmOpen(false);
    } catch (error) {
      logger.error('Bulk delete failed:', error);
      toast({
        title: 'Delete failed',
        description: 'Failed to delete characters.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkLevelUp = async () => {
    setIsLevelingUp(true);
    try {
      const result = await bulkLevelUp(selectedIds);
      if (result.failed > 0) {
        toast({
          title: 'Partial success',
          description: `Leveled up ${result.success} characters. ${result.failed} failed.`,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Characters leveled up',
          description: `Successfully leveled up ${result.success} character${result.success > 1 ? 's' : ''}.`,
        });
      }
      queryClient.invalidateQueries({ queryKey: ['characters'] });
      onClearSelection();
    } catch (error) {
      logger.error('Bulk level up failed:', error);
      toast({
        title: 'Level up failed',
        description: 'Failed to level up characters.',
        variant: 'destructive',
      });
    } finally {
      setIsLevelingUp(false);
    }
  };

  const handleBulkRest = async (restType: 'short' | 'long') => {
    setIsResting(true);
    try {
      const result = await bulkRest(selectedIds, restType);
      if (result.failed > 0) {
        toast({
          title: 'Partial success',
          description: `${restType === 'short' ? 'Short' : 'Long'} rest applied to ${result.success} characters. ${result.failed} failed.`,
          variant: 'destructive',
        });
      } else {
        toast({
          title: `${restType === 'short' ? 'Short' : 'Long'} rest complete`,
          description: `Successfully applied ${restType} rest to ${result.success} character${result.success > 1 ? 's' : ''}.`,
        });
      }
      queryClient.invalidateQueries({ queryKey: ['characters'] });
      onClearSelection();
    } catch (error) {
      logger.error('Bulk rest failed:', error);
      toast({
        title: 'Rest failed',
        description: `Failed to apply ${restType} rest.`,
        variant: 'destructive',
      });
    } finally {
      setIsResting(false);
    }
  };

  if (selectedIds.length === 0) return null;

  return (
    <>
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-background border border-primary/50 rounded-lg shadow-xl p-4 flex items-center gap-4">
        <Badge variant="default" className="gap-2">
          {selectedIds.length} selected
        </Badge>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBulkLevelUp}
            disabled={isLevelingUp || isResting || isDeleting}
            className="gap-2"
          >
            {isLevelingUp ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <TrendingUp className="w-4 h-4" />
            )}
            Level Up
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBulkRest('short')}
            disabled={isLevelingUp || isResting || isDeleting}
            className="gap-2"
          >
            {isResting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
            Short Rest
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBulkRest('long')}
            disabled={isLevelingUp || isResting || isDeleting}
            className="gap-2"
          >
            {isResting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
            Long Rest
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setDeleteConfirmOpen(true)}
            disabled={isLevelingUp || isResting || isDeleting}
            className="gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="gap-2"
          >
            <X className="w-4 h-4" />
            Clear
          </Button>
        </div>
      </div>

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedIds.length} character{selectedIds.length > 1 ? 's' : ''}?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete {selectedIds.length === 1 ? 'this character' : 'these characters'} from your roster.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

