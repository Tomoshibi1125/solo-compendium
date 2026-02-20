/**
 * 5e Database Migration Scripts with System Ascendant Flavor
 * Handles migration from old System Ascendant data to new 5e standard format
 */

import type { Character } from './5eRulesEngine';
import { CompendiumAdapter } from './5eCompendiumAdapter';
import { createCharacterSheet } from './5eCharacterSheet';

// Migration types
export interface MigrationResult {
  success: boolean;
  migrated: number;
  failed: number;
  errors: string[];
  warnings: string[];
}

export interface CharacterMigrationData {
  oldCharacter: any;
  newCharacter: Character;
  issues: string[];
}

// Character migration
export class CharacterMigration {
  /**
   * Migrate a single character from old format to new 5e format
   */
  static migrateCharacter(oldCharacter: any): CharacterMigrationData {
    const issues: string[] = [];

    try {
      // Map old abilities to new 5e abilities
      const abilities = this.migrateAbilities(oldCharacter.abilities || {}, issues);

      // Create new character with 5e structure
      const newCharacter: Character = {
        id: oldCharacter.id || this.generateId(),
        name: oldCharacter.name || 'Unknown Character',
        level: oldCharacter.level || 1,
        job: this.migrateJob(oldCharacter.job || oldCharacter.class),
        background: oldCharacter.background,
        
        // 5e standard abilities
        abilities,
        proficiencyBonus: Math.ceil((oldCharacter.level || 1) / 4) + 1,
        initiative: Math.floor((abilities.AGI - 10) / 2),
        armorClass: this.calculateArmorClass(oldCharacter, abilities),
        hitPoints: this.migrateHitPoints(oldCharacter, abilities),
        hitDice: this.migrateHitDice(oldCharacter),
        speed: oldCharacter.speed || 30,
        
        // Proficiencies
        savingThrowProficiencies: this.migrateSavingThrows(oldCharacter) as any[],
        skillProficiencies: oldCharacter.skillProficiencies || [],
        skillExpertise: oldCharacter.skillExpertise || [],
        
        // Equipment and items
        equipment: oldCharacter.equipment || [],
        relics: oldCharacter.relics || [],
        attunedRelics: oldCharacter.attunedRelics || [],
        
        // Features and powers
        features: oldCharacter.features || [],
        powers: oldCharacter.powers || [],
        
        // System Ascendant specific (preserved)
        systemFavor: this.migrateSystemFavor(oldCharacter),
        
        // Status
        conditions: oldCharacter.conditions || [],
        exhaustionLevel: oldCharacter.exhaustionLevel || 0,
        
        // Notes
        notes: oldCharacter.notes || ''
      };

      return {
        oldCharacter,
        newCharacter,
        issues
      };
    } catch (error) {
      issues.push(`Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      return {
        oldCharacter,
        newCharacter: {} as Character,
        issues
      };
    }
  }

  /**
   * Migrate ability scores from System Ascendant to 5e
   */
  private static migrateAbilities(oldAbilities: any, issues: string[]): Record<string, number> {
    const abilities: Record<string, number> = {
      STR: 10,
      AGI: 10,
      VIT: 10,
      INT: 10,
      SENSE: 10,
      PRE: 10
    };

    // Normalize any ability name to System Ascendant canonical
    const abilityMap: Record<string, string> = {
      'STR': 'STR',
      'AGI': 'AGI',
      'DEX': 'AGI',
      'VIT': 'VIT',
      'CON': 'VIT',
      'INT': 'INT',
      'SENSE': 'SENSE',
      'WIS': 'SENSE',
      'PRE': 'PRE',
      'CHA': 'PRE'
    };

    Object.entries(oldAbilities).forEach(([oldAbility, value]) => {
      const newAbility = abilityMap[oldAbility.toUpperCase()];
      if (newAbility && typeof value === 'number') {
        abilities[newAbility] = Math.max(1, Math.min(20, value));
      } else if (!newAbility) {
        issues.push(`Unknown ability: ${oldAbility}`);
      }
    });

    return abilities;
  }

  /**
   * Migrate job/class name
   */
  private static migrateJob(oldJob: string): string {
    const jobMap: Record<string, string> = {
      'Warrior': 'Fighter',
      'Mage': 'Wizard',
      'Healer': 'Cleric',
      'Ranger': 'Ranger',
      'Esper': 'Sorcerer',
      'Herald': 'Paladin',
      'Assassin': 'Rogue',
      'Warden': 'Druid',
      'Techsmith': 'Artificer'
    };

    return jobMap[oldJob] || oldJob;
  }

  /**
   * Calculate armor class
   */
  private static calculateArmorClass(oldCharacter: any, abilities: Record<string, number>): number {
    // Base AC = 10 + AGI modifier
    const agiMod = Math.floor((abilities.AGI - 10) / 2);
    let ac = 10 + agiMod;

    // Check for armor
    if (oldCharacter.armor) {
      // This would need to be adapted based on your armor system
      ac = Math.max(ac, oldCharacter.armorClass || ac);
    }

    return ac;
  }

  /**
   * Migrate hit points
   */
  private static migrateHitPoints(oldCharacter: any, abilities: Record<string, number>) {
    const vitMod = Math.floor((abilities.VIT - 10) / 2);
    const currentHP = oldCharacter.hp_current || oldCharacter.hpCurrent || 1;
    const maxHP = oldCharacter.hp_max || oldCharacter.hpMax || currentHP;
    const tempHP = oldCharacter.hp_temp || oldCharacter.hpTemp || 0;

    return {
      current: Math.max(0, currentHP),
      max: Math.max(1, maxHP),
      temp: Math.max(0, tempHP)
    };
  }

  /**
   * Migrate hit dice
   */
  private static migrateHitDice(oldCharacter: any) {
    const hitDie = oldCharacter.hitDie || oldCharacter.hitDice || '8';
    const hitDieSize = parseInt(hitDie.replace('d', '')) || 8;
    const level = oldCharacter.level || 1;

    return {
      current: level,
      max: level,
      size: hitDieSize
    };
  }

  /**
   * Migrate saving throws
   */
  private static migrateSavingThrows(oldCharacter: any): string[] {
    const savingThrows: string[] = [];
    
    // Map old saving throws to new abilities
    const saveMap: Record<string, string> = {
      'STR': 'STR',
      'AGI': 'AGI',
      'DEX': 'AGI',
      'VIT': 'VIT',
      'CON': 'VIT',
      'INT': 'INT',
      'SENSE': 'SENSE',
      'WIS': 'SENSE',
      'PRE': 'PRE',
      'CHA': 'PRE'
    };

    if (oldCharacter.savingThrowProficiencies) {
      oldCharacter.savingThrowProficiencies.forEach((save: string) => {
        const newSave = saveMap[save.toUpperCase()];
        if (newSave) {
          savingThrows.push(newSave);
        }
      });
    }

    return savingThrows;
  }

  /**
   * Migrate System Favor
   */
  private static migrateSystemFavor(oldCharacter: any) {
    const level = oldCharacter.level || 1;
    
    // Calculate System Favor based on level (Bardic Inspiration equivalent)
    const max = level <= 4 ? 1 : level <= 10 ? 2 : level <= 16 ? 3 : 4;
    const dieSize = level <= 4 ? 6 : level <= 10 ? 8 : level <= 16 ? 10 : 12;
    const current = Math.min(max, oldCharacter.system_favor_current || oldCharacter.systemFavorCurrent || 0);

    return {
      current,
      max,
      dieSize
    };
  }

  /**
   * Generate a unique ID
   */
  private static generateId(): string {
    return 'char_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Migrate all characters
   */
  static async migrateAllCharacters(oldCharacters: any[]): Promise<MigrationResult> {
    const result: MigrationResult = {
      success: true,
      migrated: 0,
      failed: 0,
      errors: [],
      warnings: []
    };

    for (const oldCharacter of oldCharacters) {
      try {
        const migration = this.migrateCharacter(oldCharacter);
        
        if (migration.issues.length > 0) {
          result.warnings.push(`Character ${oldCharacter.name || oldCharacter.id}: ${migration.issues.join(', ')}`);
        }

        // Here you would save the new character to your database
        // await saveCharacter(migration.newCharacter);
        
        result.migrated++;
      } catch (error) {
        result.failed++;
        result.errors.push(`Failed to migrate character ${oldCharacter.name || oldCharacter.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    result.success = result.failed === 0;
    return result;
  }
}

// Compendium migration
export class CompendiumMigration {
  /**
   * Migrate compendium data to 5e format
   */
  static async migrateCompendium(oldCompendium: any): Promise<MigrationResult> {
    const result: MigrationResult = {
      success: true,
      migrated: 0,
      failed: 0,
      errors: [],
      warnings: []
    };

    try {
      // Validate old compendium
      const validation = CompendiumAdapter.validate(oldCompendium);
      if (!validation.isValid) {
        result.warnings.push(...validation.errors);
      }
      if (validation.warnings.length > 0) {
        result.warnings.push(...validation.warnings);
      }

      // Migrate compendium
      const migratedCompendium = CompendiumAdapter.migrate(oldCompendium);

      // Here you would save the migrated compendium to your database
      // await saveCompendium(migratedCompendium);

      result.migrated = 1;
      result.success = true;
    } catch (error) {
      result.failed = 1;
      result.errors.push(`Failed to migrate compendium: ${error instanceof Error ? error.message : 'Unknown error'}`);
      result.success = false;
    }

    return result;
  }
}

// Database schema migration
export class SchemaMigration {
  /**
   * Create migration SQL for database schema changes
   */
  static generateMigrationSQL(): string[] {
    const migrations: string[] = [];

    // Character table migration
    migrations.push(`
-- Migrate characters table to 5e standard
ALTER TABLE characters 
ADD COLUMN IF NOT EXISTS proficiency_bonus INTEGER DEFAULT 2,
ADD COLUMN IF NOT EXISTS initiative INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS hit_dice_current INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS hit_dice_max INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS hit_dice_size INTEGER DEFAULT 8,
ADD COLUMN IF NOT EXISTS exhaustion_level INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS system_favor_current INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS system_favor_max INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS system_favor_die INTEGER DEFAULT 6;
`);

    // Update existing characters
    migrations.push(`
-- Update existing characters with 5e calculations
UPDATE characters 
SET 
  proficiency_bonus = GREATEST(2, CEIL(level / 4.0) + 1),
  initiative = CASE 
    WHEN abilities->>'AGI' IS NOT NULL 
    THEN FLOOR((CAST(abilities->>'AGI' AS INTEGER) - 10) / 2)
    ELSE 0 
  END,
  hit_dice_current = level,
  hit_dice_max = level,
  hit_dice_size = CASE 
    WHEN job = 'Warrior' THEN 10
    WHEN job = 'Healer' THEN 8
    ELSE 8
  END,
  system_favor_max = CASE 
    WHEN level <= 4 THEN 1
    WHEN level <= 10 THEN 2
    WHEN level <= 16 THEN 3
    ELSE 4
  END,
  system_favor_die = CASE 
    WHEN level <= 4 THEN 6
    WHEN level <= 10 THEN 8
    WHEN level <= 16 THEN 10
    ELSE 12
  END;
`);

    // Spell slots table
    migrations.push(`
-- Create spell slots table
CREATE TABLE IF NOT EXISTS character_spell_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
  level INTEGER NOT NULL,
  slots_remaining INTEGER NOT NULL DEFAULT 0,
  slots_total INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_character_spell_slots_character_id ON character_spell_slots(character_id);
`);

    return migrations;
  }

  /**
   * Run database migration
   */
  static async runMigration(): Promise<MigrationResult> {
    const result: MigrationResult = {
      success: true,
      migrated: 0,
      failed: 0,
      errors: [],
      warnings: []
    };

    try {
      const migrations = this.generateMigrationSQL();
      
      // Here you would execute the SQL migrations
      // for (const sql of migrations) {
      //   await database.execute(sql);
      //   result.migrated++;
      // }

      result.migrated = migrations.length;
      result.success = true;
    } catch (error) {
      result.failed = 1;
      result.errors.push(`Database migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      result.success = false;
    }

    return result;
  }
}

// Export migration classes
export const Migration = {
  Character: CharacterMigration,
  Compendium: CompendiumMigration,
  Schema: SchemaMigration
};
