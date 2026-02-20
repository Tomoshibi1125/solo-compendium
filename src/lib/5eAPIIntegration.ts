/**
 * 5e API Integration with System Ascendant Flavor
 * Provides API endpoints and data access for 5e mechanics
 */

import type { Character, Job, Power, Relic } from './5eRulesEngine';
import { createCharacterSheet, CharacterSheetSystem, type CharacterSheet } from './5eCharacterSheet';
import { SpellSystem } from './5eSpellSystem';
import { CompendiumAdapter } from './5eCompendiumAdapter';

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface CharacterApiResponse extends ApiResponse<CharacterSheet> {
  characterId?: string;
}

export interface CompendiumSearchResponse extends ApiResponse<any[]> {
  query?: string;
  type?: string;
  total?: number;
}

// Character API endpoints
export class CharacterAPI {
  /**
   * Get character sheet by ID
   */
  static async getCharacter(characterId: string): Promise<CharacterApiResponse> {
    try {
      // This would integrate with your database/API
      // For now, return a mock response
      const mockCharacter: Character = {
        id: characterId,
        name: 'Test Character',
        level: 5,
        job: 'Mage',
        abilities: { STR: 10, AGI: 14, VIT: 12, INT: 16, SENSE: 8, PRE: 8 },
        proficiencyBonus: 3,
        initiative: 2,
        armorClass: 12,
        hitPoints: { current: 25, max: 25, temp: 0 },
        hitDice: { current: 5, max: 5, size: 8 },
        speed: 30,
        conditions: [],
        exhaustionLevel: 0,
        savingThrowProficiencies: ['INT', 'SENSE'],
        skillProficiencies: ['arcana', 'investigation'],
        skillExpertise: [],
        equipment: [],
        relics: [],
        attunedRelics: [],
        features: [],
        powers: [],
        systemFavor: { current: 2, max: 2, dieSize: 6 },
        notes: ''
      };

      const sheet = createCharacterSheet(mockCharacter);
      
      return {
        success: true,
        data: sheet,
        characterId
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Update character
   */
  static async updateCharacter(characterId: string, updates: Partial<Character>): Promise<CharacterApiResponse> {
    try {
      // Get current character
      const current = await this.getCharacter(characterId);
      if (!current.success || !current.data) {
        return { success: false, error: 'Character not found' };
      }

      // Apply updates
      const updatedCharacter = { ...current.data.character, ...updates };
      const updatedSheet = createCharacterSheet(updatedCharacter);

      return {
        success: true,
        data: updatedSheet,
        characterId
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Level up character
   */
  static async levelUpCharacter(characterId: string, newLevel: number): Promise<CharacterApiResponse> {
    try {
      const current = await this.getCharacter(characterId);
      if (!current.success || !current.data) {
        return { success: false, error: 'Character not found' };
      }

      const updatedSheet = CharacterSheetSystem.levelUp(current.data.character, newLevel);

      return {
        success: true,
        data: updatedSheet,
        characterId
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Apply damage to character
   */
  static async applyDamage(characterId: string, damage: number): Promise<CharacterApiResponse> {
    try {
      const current = await this.getCharacter(characterId);
      if (!current.success || !current.data) {
        return { success: false, error: 'Character not found' };
      }

      const updatedSheet = CharacterSheetSystem.applyDamage(current.data, damage);

      return {
        success: true,
        data: updatedSheet,
        characterId
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Apply healing to character
   */
  static async applyHealing(characterId: string, healing: number): Promise<CharacterApiResponse> {
    try {
      const current = await this.getCharacter(characterId);
      if (!current.success || !current.data) {
        return { success: false, error: 'Character not found' };
      }

      const updatedSheet = CharacterSheetSystem.applyHealing(current.data, healing);

      return {
        success: true,
        data: updatedSheet,
        characterId
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Long rest for character
   */
  static async longRest(characterId: string): Promise<CharacterApiResponse> {
    try {
      const current = await this.getCharacter(characterId);
      if (!current.success || !current.data) {
        return { success: false, error: 'Character not found' };
      }

      const updatedSheet = CharacterSheetSystem.longRest(current.data);

      return {
        success: true,
        data: updatedSheet,
        characterId
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

// Spell API endpoints
export class SpellAPI {
  /**
   * Cast a spell
   */
  static async castSpell(characterId: string, spellId: string): Promise<ApiResponse<any>> {
    try {
      const character = await CharacterAPI.getCharacter(characterId);
      if (!character.success || !character.data) {
        return { success: false, error: 'Character not found' };
      }

      // This would get the actual spell from compendium
      const mockSpell = {
        id: spellId,
        name: 'Test Spell',
        level: 1,
        school: 'Evocation',
        castingTime: '1 action',
        range: '60 feet',
        duration: 'Instantaneous',
        components: 'V, S',
        concentration: false,
        ritual: false,
        description: 'A test spell',
        classes: ['Mage']
      };

      const currentSlots = SpellSystem.getCharacterSpellSlots(character.data.character);
      const result = SpellSystem.castSpell(character.data.character, mockSpell, currentSlots, []);

      if (!result.success) {
        return { success: false, error: 'Cannot cast spell' };
      }

      // Update character with new spell slots
      const updatedCharacter = await CharacterAPI.updateCharacter(characterId, {
        // This would update the spell slots in the database
      });

      return {
        success: true,
        data: {
          spell: mockSpell,
          remainingSlots: result.newSlots,
          message: 'Spell cast successfully'
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Prepare spells
   */
  static async prepareSpells(characterId: string, spellIds: string[]): Promise<ApiResponse<any>> {
    try {
      const character = await CharacterAPI.getCharacter(characterId);
      if (!character.success || !character.data) {
        return { success: false, error: 'Character not found' };
      }

      // This would get actual spells from compendium
      const allSpells: any[] = []; // Would fetch from database

      const result = SpellSystem.prepareSpells(character.data.character, spellIds, allSpells, []);

      if (!result.success) {
        return { success: false, error: result.message };
      }

      return {
        success: true,
        data: {
          preparedSpells: result.preparedSpells,
          message: 'Spells prepared successfully'
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

// Compendium API endpoints
export class CompendiumAPI {
  /**
   * Search compendium
   */
  static async search(query: string, type?: string): Promise<CompendiumSearchResponse> {
    try {
      // This would search your actual compendium data
      const mockResults = [
        {
          id: 'fireball',
          name: 'Fireball',
          type: 'power',
          description: 'A fiery explosion',
          level: 3,
          school: 'Evocation'
        },
        {
          id: 'longsword',
          name: 'Longsword',
          type: 'relic',
          description: 'A classic sword',
          rarity: 'common'
        }
      ];

      const filteredResults = mockResults.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase()) &&
        (!type || item.type === type)
      );

      return {
        success: true,
        data: filteredResults,
        query,
        type,
        total: filteredResults.length
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get item by ID
   */
  static async getItem(itemId: string, type: 'job' | 'power' | 'relic'): Promise<ApiResponse<any>> {
    try {
      // This would fetch from your actual compendium
      const mockItem = {
        id: itemId,
        name: 'Mock Item',
        type,
        description: 'A mock compendium item'
      };

      return {
        success: true,
        data: mockItem
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Validate compendium data
   */
  static async validateCompendium(): Promise<ApiResponse<any>> {
    try {
      // This would validate your actual compendium data
      const mockCompendium = {
        jobs: [],
        powers: [],
        relics: []
      };

      const validation = CompendiumAdapter.validate(mockCompendium);

      return {
        success: validation.isValid,
        data: validation,
        message: validation.isValid ? 'Compendium is valid' : 'Compendium has issues'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

// Utility API endpoints
export class UtilityAPI {
  /**
   * Get system status
   */
  static async getStatus(): Promise<ApiResponse<any>> {
    return {
      success: true,
      data: {
        version: '1.0.0',
        system: 'System Ascendant 5e',
        features: [
          '5e Rules Engine',
          'Character Sheets',
          'Spell System',
          'Compendium',
          'Combat System'
        ],
        status: 'operational'
      }
    };
  }

  /**
   * Get help/documentation
   */
  static async getHelp(topic?: string): Promise<ApiResponse<any>> {
    const helpData: Record<string, string> = {
      'character-creation': 'Create a new character with 5e rules',
      'spellcasting': 'Cast spells using spell slots',
      'combat': 'Run combat encounters',
      'compendium': 'Browse items, spells, and classes'
    };

    const help = topic ? helpData[topic] || 'Topic not found' : 'Available topics: ' + Object.keys(helpData).join(', ');

    return {
      success: true,
      data: {
        topic,
        help
      }
    };
  }
}

// Export all API classes
export const API = {
  Character: CharacterAPI,
  Spell: SpellAPI,
  Compendium: CompendiumAPI,
  Utility: UtilityAPI
};
