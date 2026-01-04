/**
 * Undo/Redo system for character edits
 * Provides history tracking and undo/redo functionality
 */

export interface HistoryEntry<T> {
  state: T;
  timestamp: number;
  description?: string;
}

export class UndoRedoManager<T> {
  private history: HistoryEntry<T>[] = [];
  private currentIndex: number = -1;
  private maxHistorySize: number = 50;

  constructor(initialState: T, maxHistorySize: number = 50) {
    this.maxHistorySize = maxHistorySize;
    this.push(initialState, 'Initial state');
  }

  /**
   * Push a new state to history
   */
  push(state: T, description?: string): void {
    // Remove any states after current index (when undoing then making new change)
    this.history = this.history.slice(0, this.currentIndex + 1);

    // Add new state
    this.history.push({
      state: JSON.parse(JSON.stringify(state)), // Deep clone
      timestamp: Date.now(),
      description,
    });

    // Limit history size
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
    } else {
      this.currentIndex = this.history.length - 1;
    }
  }

  /**
   * Undo to previous state
   */
  undo(): T | null {
    if (this.canUndo()) {
      this.currentIndex--;
      return this.getCurrentState();
    }
    return null;
  }

  /**
   * Redo to next state
   */
  redo(): T | null {
    if (this.canRedo()) {
      this.currentIndex++;
      return this.getCurrentState();
    }
    return null;
  }

  /**
   * Get current state
   */
  getCurrentState(): T | null {
    if (this.currentIndex >= 0 && this.currentIndex < this.history.length) {
      return JSON.parse(JSON.stringify(this.history[this.currentIndex].state));
    }
    return null;
  }

  /**
   * Check if undo is possible
   */
  canUndo(): boolean {
    return this.currentIndex > 0;
  }

  /**
   * Check if redo is possible
   */
  canRedo(): boolean {
    return this.currentIndex < this.history.length - 1;
  }

  /**
   * Get history info
   */
  getHistoryInfo(): {
    current: number;
    total: number;
    canUndo: boolean;
    canRedo: boolean;
  } {
    return {
      current: this.currentIndex + 1,
      total: this.history.length,
      canUndo: this.canUndo(),
      canRedo: this.canRedo(),
    };
  }

  /**
   * Clear history
   */
  clear(): void {
    const currentState = this.getCurrentState();
    this.history = currentState ? [{
      state: currentState,
      timestamp: Date.now(),
      description: 'Current state',
    }] : [];
    this.currentIndex = this.history.length - 1;
  }
}

/**
 * React hook for undo/redo
 */
export function useUndoRedo<T>(initialState: T, maxHistorySize: number = 50) {
  const manager = new UndoRedoManager(initialState, maxHistorySize);

  return {
    push: (state: T, description?: string) => manager.push(state, description),
    undo: () => manager.undo(),
    redo: () => manager.redo(),
    canUndo: () => manager.canUndo(),
    canRedo: () => manager.canRedo(),
    getCurrentState: () => manager.getCurrentState(),
    getHistoryInfo: () => manager.getHistoryInfo(),
    clear: () => manager.clear(),
  };
}

