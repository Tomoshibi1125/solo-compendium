import { useRef, useCallback } from 'react';
import { UndoRedoManager } from '@/lib/undoRedo';
import type { CharacterWithAbilities } from '@/hooks/useCharacters';

/**
 * Hook for character undo/redo functionality
 * Tracks character state changes for undo/redo operations
 */
export function useCharacterUndoRedo(character: CharacterWithAbilities | null) {
  const managerRef = useRef<UndoRedoManager<CharacterWithAbilities> | null>(null);

  // Initialize manager when character loads
  if (character && !managerRef.current) {
    managerRef.current = new UndoRedoManager(character, 20);
  }

  // Update current state when character changes (but not from undo/redo)
  const pushState = useCallback((state: CharacterWithAbilities, description?: string) => {
    if (managerRef.current) {
      managerRef.current.push(state, description);
    }
  }, []);

  const undo = useCallback((): CharacterWithAbilities | null => {
    if (managerRef.current) {
      return managerRef.current.undo();
    }
    return null;
  }, []);

  const redo = useCallback((): CharacterWithAbilities | null => {
    if (managerRef.current) {
      return managerRef.current.redo();
    }
    return null;
  }, []);

  const canUndo = useCallback((): boolean => {
    return managerRef.current?.canUndo() ?? false;
  }, []);

  const canRedo = useCallback((): boolean => {
    return managerRef.current?.canRedo() ?? false;
  }, []);

  const getHistoryInfo = useCallback(() => {
    return managerRef.current?.getHistoryInfo() ?? {
      current: 0,
      total: 0,
      canUndo: false,
      canRedo: false,
    };
  }, []);

  return {
    pushState,
    undo,
    redo,
    canUndo,
    canRedo,
    getHistoryInfo,
  };
}

