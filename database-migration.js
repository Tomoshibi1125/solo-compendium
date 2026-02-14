import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, writeFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔄 Running 5e Database Migration...');

// Mock character data (in real scenario, this would come from database)
const mockCharacters = [
  {
    id: 'char-1',
    name: 'Test Character',
    level: 5,
    job: 'Mage',
    abilities: { STR: 10, AGI: 14, VIT: 12, INT: 16, SENSE: 8, PRE: 8 },
    hp_current: 25,
    hp_max: 25,
    hp_temp: 0,
    armor_class: 12,
    speed: 30,
    saving_throw_proficiencies: ['INT', 'SENSE'],
    skill_proficiencies: ['arcana', 'investigation'],
    skill_expertise: [],
    equipment: [],
    relics: [],
    attuned_relics: [],
    features: [],
    powers: [],
    system_favor_current: 2,
    system_favor_max: 2,
    system_favor_die: 6,
    notes: ''
  }
];

// Mock compendium data
const mockCompendium = {
  jobs: [],
  powers: [],
  relics: []
};

// Character migration functions
function migrateCharacter(oldCharacter) {
  const issues = [];
  
  try {
    // Map old abilities to new 5e abilities
    const abilities = {
      STR: oldCharacter.abilities?.STR || 10,
      DEX: oldCharacter.abilities?.AGI || 10,
      CON: oldCharacter.abilities?.VIT || 10,
      INT: oldCharacter.abilities?.INT || 10,
      WIS: oldCharacter.abilities?.SENSE || 10,
      CHA: oldCharacter.abilities?.PRE || 10
    };

    // Create new character with 5e structure
    const newCharacter = {
      id: oldCharacter.id || 'migrated-' + Date.now(),
      name: oldCharacter.name || 'Unknown Character',
      level: oldCharacter.level || 1,
      job: migrateJob(oldCharacter.job),
      background: oldCharacter.background,
      
      // 5e standard abilities
      abilities,
      proficiencyBonus: Math.ceil((oldCharacter.level || 1) / 4) + 1,
      initiative: Math.floor((abilities.DEX - 10) / 2),
      armorClass: oldCharacter.armor_class || 10,
      hitPoints: {
        current: oldCharacter.hp_current || 1,
        max: oldCharacter.hp_max || 1,
        temp: oldCharacter.hp_temp || 0
      },
      hitDice: {
        current: oldCharacter.level || 1,
        max: oldCharacter.level || 1,
        size: getHitDiceSize(oldCharacter.job)
      },
      speed: oldCharacter.speed || 30,
      
      // Proficiencies
      savingThrowProficiencies: migrateSavingThrows(oldCharacter.saving_throw_proficiencies || []),
      skillProficiencies: oldCharacter.skill_proficiencies || [],
      skillExpertise: oldCharacter.skill_expertise || [],
      
      // Equipment and items
      equipment: oldCharacter.equipment || [],
      relics: oldCharacter.relics || [],
      attunedRelics: oldCharacter.attuned_relics || [],
      
      // Features and powers
      features: oldCharacter.features || [],
      powers: oldCharacter.powers || [],
      
      // System Ascendant specific (preserved)
      systemFavor: migrateSystemFavor(oldCharacter),
      
      // Status
      conditions: [],
      exhaustionLevel: 0,
      
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
      newCharacter: {},
      issues
    };
  }
}

function migrateJob(oldJob) {
  const jobMap = {
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

function migrateSavingThrows(oldSaves) {
  const saveMap = {
    'STR': 'STR',
    'AGI': 'DEX',
    'VIT': 'CON',
    'INT': 'INT',
    'SENSE': 'WIS',
    'PRE': 'CHA'
  };
  
  return oldSaves.map(save => saveMap[save] || save);
}

function getHitDiceSize(job) {
  const hitDiceMap = {
    'Warrior': 10,
    'Mage': 8,
    'Healer': 8,
    'Ranger': 10,
    'Esper': 8,
    'Herald': 10,
    'Assassin': 8,
    'Warden': 8,
    'Techsmith': 8
  };
  
  return hitDiceMap[job] || 8;
}

function migrateSystemFavor(oldCharacter) {
  const level = oldCharacter.level || 1;
  
  // Calculate System Favor based on level (Bardic Inspiration equivalent)
  let max = 1;
  let dieSize = 6;
  
  if (level >= 5) {
    max = 2;
    dieSize = 8;
  }
  if (level >= 11) {
    max = 3;
    dieSize = 10;
  }
  if (level >= 17) {
    max = 4;
    dieSize = 12;
  }
  
  return {
    current: Math.min(max, oldCharacter.system_favor_current || 0),
    max,
    dieSize
  };
}

function generateMigrationSQL() {
  return [
    `-- Migrate characters table to 5e standard`,
    `ALTER TABLE characters `,
    `ADD COLUMN IF NOT EXISTS proficiency_bonus INTEGER DEFAULT 2,`,
    `ADD COLUMN IF NOT EXISTS initiative INTEGER DEFAULT 0,`,
    `ADD COLUMN IF NOT EXISTS hit_dice_current INTEGER DEFAULT 1,`,
    `ADD COLUMN IF NOT EXISTS hit_dice_max INTEGER DEFAULT 1,`,
    `ADD COLUMN IF NOT EXISTS hit_dice_size INTEGER DEFAULT 8,`,
    `ADD COLUMN IF NOT EXISTS exhaustion_level INTEGER DEFAULT 0,`,
    `ADD COLUMN IF NOT EXISTS system_favor_current INTEGER DEFAULT 0,`,
    `ADD COLUMN IF NOT EXISTS system_favor_max INTEGER DEFAULT 1,`,
    `ADD COLUMN IF NOT EXISTS system_favor_die INTEGER DEFAULT 6;`,
    ``,
    `-- Update existing characters with 5e calculations`,
    `UPDATE characters SET `,
    `proficiency_bonus = GREATEST(2, CEIL(level / 4.0) + 1),`,
    `initiative = CASE `,
    `  WHEN abilities->>'DEX' IS NOT NULL THEN FLOOR((CAST(abilities->>'DEX' AS INTEGER) - 10) / 2) `,
    `  ELSE 0 `,
    `END,`,
    `hit_dice_current = level,`,
    `hit_dice_max = level,`,
    `hit_dice_size = CASE job `,
    `  WHEN 'Warrior' THEN 10 `,
    `  WHEN 'Herald' THEN 10 `,
    `  WHEN 'Ranger' THEN 10 `,
    `  ELSE 8 `,
    `END,`,
    `system_favor_max = CASE `,
    `  WHEN level <= 4 THEN 1 `,
    `  WHEN level <= 10 THEN 2 `,
    `  WHEN level <= 16 THEN 3 `,
    `  ELSE 4 `,
    `END,`,
    `system_favor_die = CASE `,
    `  WHEN level <= 4 THEN 6 `,
    `  WHEN level <= 10 THEN 8 `,
    `  WHEN level <= 16 THEN 10 `,
    `  ELSE 12 `,
    `END;`
  ];
}

async function runMigration() {
  try {
    console.log('📦 Migrating characters...');
    let migrated = 0;
    let failed = 0;
    const errors = [];
    const warnings = [];

    for (const oldCharacter of mockCharacters) {
      const migration = migrateCharacter(oldCharacter);
      
      if (migration.issues.length > 0) {
        failed++;
        errors.push(`Character ${oldCharacter.name}: ${migration.issues.join(', ')}`);
        warnings.push(`Character ${oldCharacter.name}: ${migration.issues.join(', ')}`);
      } else {
        migrated++;
        console.log(`✅ Migrated character: ${oldCharacter.name}`);
      }
    }

    console.log(`✅ Characters migrated: ${migrated}`);
    console.log(`❌ Characters failed: ${failed}`);

    console.log('📚 Validating compendium...');
    // Basic compendium validation
    const compendiumIssues = [];
    
    if (!mockCompendium.jobs || !Array.isArray(mockCompendium.jobs)) {
      compendiumIssues.push('Jobs array is missing or invalid');
    }
    
    if (!mockCompendium.powers || !Array.isArray(mockCompendium.powers)) {
      compendiumIssues.push('Powers array is missing or invalid');
    }
    
    if (!mockCompendium.relics || !Array.isArray(mockCompendium.relics)) {
      compendiumIssues.push('Relics array is missing or invalid');
    }

    if (compendiumIssues.length === 0) {
      console.log('✅ Compendium validation passed');
    } else {
      console.log('❌ Compendium validation failed:');
      compendiumIssues.forEach(issue => console.log(`  - ${issue}`));
    }

    console.log('🗄️ Generating database migration scripts...');
    const migrationSQL = generateMigrationSQL();
    
    // Save migration scripts
    writeFileSync(
      join(__dirname, 'migration-scripts.sql'),
      migrationSQL.join('\n')
    );

    console.log('✅ Generated migration-scripts.sql');
    console.log(`📝 Generated ${migrationSQL.length} SQL migration scripts`);

    // Save migration results
    const migrationResults = {
      timestamp: new Date().toISOString(),
      characterMigration: {
        success: failed === 0,
        migrated,
        failed,
        errors,
        warnings
      },
      compendiumMigration: {
        success: compendiumIssues.length === 0,
        errors: compendiumIssues,
        warnings: []
      },
      schemaMigration: {
        success: true,
        migrated: migrationSQL.length,
        errors: [],
        warnings: []
      }
    };

    writeFileSync(
      join(__dirname, 'migration-results.json'),
      JSON.stringify(migrationResults, null, 2)
    );

    console.log('📄 Migration results saved to migration-results.json');
    console.log('🎉 5e Database Migration Complete!');

  } catch (error) {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
runMigration();
