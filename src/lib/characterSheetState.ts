import { initializeCharacterResources, type CharacterResources } from '@/lib/characterResources';
import type { CustomModifier } from '@/lib/customModifiers';

export interface CharacterSheetState {
  resources: CharacterResources;
  customModifiers: CustomModifier[];
}

export function createDefaultCharacterSheetState(): CharacterSheetState {
  return {
    resources: initializeCharacterResources(),
    customModifiers: [],
  };
}
