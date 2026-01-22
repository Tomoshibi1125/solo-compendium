import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getErrorMessage, logErrorWithContext } from '@/lib/errorHandling';
import { logger } from '@/lib/logger';
import { AppError } from '@/lib/appError';
import { useAuth } from '@/lib/auth/authContext';
import type { CharacterWithAbilities } from './useCharacters';

export interface CharacterBackup {
  id: string;
  character_id: string;
  backup_data: CharacterWithAbilities;
  backup_name?: string;
  created_at: string;
  version: number;
}

const STORAGE_KEY_PREFIX = 'character-backup-';
const MAX_LOCAL_BACKUPS = 10;

/**
 * Create a backup of a character (localStorage)
 */
export function createLocalBackup(character: CharacterWithAbilities, backupName?: string): string {
  if (typeof window === 'undefined') {
    throw new AppError('Local storage is not available', 'CONFIG');
  }
  const backup: CharacterBackup = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    character_id: character.id,
    backup_data: JSON.parse(JSON.stringify(character)), // Deep clone
    backup_name: backupName,
    created_at: new Date().toISOString(),
    version: 1,
  };

  try {
    const key = `${STORAGE_KEY_PREFIX}${character.id}`;
    const existing = loadLocalBackups(character.id);
    
    // Add new backup
    const updated = [backup, ...existing].slice(0, MAX_LOCAL_BACKUPS);
    
    localStorage.setItem(key, JSON.stringify(updated));
    logger.log(`Backup created for character ${character.id}`);
    return backup.id;
  } catch (error) {
    logErrorWithContext(error, 'createLocalBackup');
    throw error;
  }
}

/**
 * Load all backups for a character from localStorage
 */
export function loadLocalBackups(characterId: string): CharacterBackup[] {
  try {
    if (typeof window === 'undefined') return [];
    const key = `${STORAGE_KEY_PREFIX}${characterId}`;
    const stored = localStorage.getItem(key);
    if (!stored) return [];
    return JSON.parse(stored) as CharacterBackup[];
  } catch (error) {
    logErrorWithContext(error, 'loadLocalBackups');
    return [];
  }
}

/**
 * Restore a character from backup
 */
export function restoreFromBackup(backup: CharacterBackup): CharacterWithAbilities {
  return backup.backup_data;
}

/**
 * Delete a local backup
 */
export function deleteLocalBackup(characterId: string, backupId: string): void {
  try {
    if (typeof window === 'undefined') return;
    const key = `${STORAGE_KEY_PREFIX}${characterId}`;
    const backups = loadLocalBackups(characterId);
    const filtered = backups.filter(b => b.id !== backupId);
    localStorage.setItem(key, JSON.stringify(filtered));
  } catch (error) {
    logErrorWithContext(error, 'deleteLocalBackup');
    throw error;
  }
}

/**
 * Export backup to JSON file
 */
export function exportBackupToFile(backup: CharacterBackup): void {
  const dataStr = JSON.stringify(backup, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `character-backup-${backup.character_id}-${backup.id}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Import backup from JSON file
 */
export function importBackupFromFile(file: File): Promise<CharacterBackup> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const backup = JSON.parse(e.target?.result as string) as CharacterBackup;
        // Validate backup structure
        if (!backup.character_id || !backup.backup_data) {
          throw new AppError('Invalid backup file format', 'INVALID_INPUT');
        }
        resolve(backup);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

/**
 * Hook for managing character backups
 */
export function useCharacterBackups(characterId: string) {
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const isAuthed = isSupabaseConfigured && !!user?.id;

  const { data: backups = [], refetch } = useQuery({
    queryKey: ['character-backups', characterId, isAuthed ? user?.id : 'guest'],
    queryFn: async () => {
      if (!characterId) return [];
      if (!isAuthed || !user?.id) {
        return loadLocalBackups(characterId);
      }
      const { data, error } = await supabase
        .from('character_backups')
        .select('id, character_id, backup_data, backup_name, created_at, version')
        .eq('character_id', characterId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as CharacterBackup[];
    },
    enabled: !!characterId && !loading,
  });

  const createBackup = useMutation({
    mutationFn: async ({ character, backupName }: { character: CharacterWithAbilities; backupName?: string }) => {
      if (!isAuthed || !user?.id) {
        return createLocalBackup(character, backupName);
      }
      const { data, error } = await supabase
        .from('character_backups')
        .insert({
          user_id: user.id,
          character_id: character.id,
          backup_data: JSON.parse(JSON.stringify(character)),
          backup_name: backupName,
          version: 1,
        })
        .select('id')
        .single();
      if (error) throw error;
      return data?.id;
    },
    onSuccess: (backupId) => {
      refetch();
      toast({
        title: 'Backup created',
        description: 'Character backup saved successfully.',
      });
      return backupId;
    },
    onError: (error) => {
      logErrorWithContext(error, 'useCharacterBackups.createBackup');
      toast({
        title: 'Failed to create backup',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });

  const deleteBackup = useMutation({
    mutationFn: async (backupId: string) => {
      if (!isAuthed || !user?.id) {
        deleteLocalBackup(characterId, backupId);
        return;
      }
      const { error } = await supabase
        .from('character_backups')
        .delete()
        .eq('id', backupId)
        .eq('user_id', user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      refetch();
      toast({
        title: 'Backup deleted',
        description: 'Backup has been removed.',
      });
    },
    onError: (error) => {
      logErrorWithContext(error, 'useCharacterBackups.deleteBackup');
      toast({
        title: 'Failed to delete backup',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });

  const exportBackup = useMutation({
    mutationFn: async (backup: CharacterBackup) => {
      exportBackupToFile(backup);
    },
    onSuccess: () => {
      toast({
        title: 'Backup exported',
        description: 'Backup file downloaded.',
      });
    },
    onError: (error) => {
      logErrorWithContext(error, 'useCharacterBackups.exportBackup');
      toast({
        title: 'Failed to export backup',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });

  const importBackup = useMutation({
    mutationFn: async (backup: CharacterBackup) => {
      if (!isAuthed || !user?.id) {
        if (typeof window === 'undefined') {
          throw new AppError('Local storage is not available', 'CONFIG');
        }
        const key = `${STORAGE_KEY_PREFIX}${backup.character_id}`;
        const existing = loadLocalBackups(backup.character_id);
        const normalized: CharacterBackup = {
          ...backup,
          id: backup.id || `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        };
        const updated = [normalized, ...existing].slice(0, MAX_LOCAL_BACKUPS);
        localStorage.setItem(key, JSON.stringify(updated));
        return normalized.id;
      }

      const { data, error } = await supabase
        .from('character_backups')
        .insert({
          user_id: user.id,
          character_id: backup.character_id,
          backup_data: backup.backup_data,
          backup_name: backup.backup_name,
          version: backup.version ?? 1,
          created_at: backup.created_at,
        })
        .select('id')
        .single();
      if (error) throw error;
      return data?.id;
    },
    onSuccess: () => {
      refetch();
      toast({
        title: 'Backup imported',
        description: 'Backup file imported successfully.',
      });
    },
    onError: (error) => {
      logErrorWithContext(error, 'useCharacterBackups.importBackup');
      toast({
        title: 'Failed to import backup',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });

  return {
    backups,
    createBackup: createBackup.mutateAsync,
    deleteBackup: deleteBackup.mutateAsync,
    exportBackup: exportBackup.mutateAsync,
    importBackup: importBackup.mutateAsync,
    isLoading: createBackup.isPending || deleteBackup.isPending || exportBackup.isPending || importBackup.isPending,
  };
}

/**
 * Auto-backup on character changes
 */
export function useAutoBackup(character: CharacterWithAbilities | null, enabled: boolean = true) {
  const { createBackup } = useCharacterBackups(character?.id || '');
  const lastBackupRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (!enabled || !character) return;

    // Only backup if character data has actually changed
    const characterHash = JSON.stringify({
      name: character.name,
      level: character.level,
      hp_current: character.hp_current,
      hp_max: character.hp_max,
      updated_at: character.updated_at,
    });

    if (lastBackupRef.current === characterHash) return;
    lastBackupRef.current = characterHash;

    // Debounce: wait 5 seconds after last change
    const timeout = setTimeout(() => {
      createBackup({ character, backupName: 'Auto-backup' }).catch(() => {
        // Silent fail for auto-backups
      });
    }, 5000);

    return () => clearTimeout(timeout);
  }, [character, enabled, createBackup]);
}

