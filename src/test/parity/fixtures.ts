/**
 * Test Fixtures for Parity Testing
 * 
 * Creates standardized test characters for testing automation flows
 */

import type { Database } from '@/integrations/supabase/types';

type Character = Database['public']['Tables']['characters']['Row'];
type CharacterInsert = Database['public']['Tables']['characters']['Insert'];
type Equipment = Database['public']['Tables']['character_equipment']['Insert'];
type Power = Database['public']['Tables']['character_powers']['Insert'];
type Feature = Database['public']['Tables']['character_features']['Insert'];

/**
 * Create a martial character (fighter-type) for testing
 * - High STR/AGI
 * - Weapon-focused
 * - Armor equipped
 * - Attacks and rests
 */
export function createMartialCharacter(): {
  character: CharacterInsert;
  equipment: Equipment[];
  powers: Power[];
  features: Feature[];
} {
  const character: CharacterInsert = {
    user_id: 'test-user-id', // Required field for test fixtures
    name: 'Test Fighter',
    level: 5,
    job: 'Striker',
    path: 'Weapon Master',
    background: 'Soldier',
    proficiency_bonus: 3,
    armor_class: 18,
    speed: 30,
    initiative: 3,
    hp_current: 45,
    hp_max: 45,
    hp_temp: 0,
    hit_dice_current: 5,
    hit_dice_max: 5,
    hit_dice_size: 10,
    system_favor_current: 3,
    system_favor_max: 3,
    system_favor_die: 6,
    saving_throw_proficiencies: ['STR', 'VIT'],
    skill_proficiencies: ['Athletics', 'Intimidation', 'Perception', 'Survival'],
    skill_expertise: [],
    armor_proficiencies: ['light', 'medium', 'heavy', 'shields'],
    weapon_proficiencies: ['simple', 'martial'],
    tool_proficiencies: [],
    conditions: [],
    exhaustion_level: 0,
  };

  const equipment: Equipment[] = [
    {
      character_id: '', // Will be set after character creation
      name: 'Longsword',
      item_type: 'weapon',
      properties: ['+1 to attack', '+1 to damage'],
      is_equipped: true,
      is_attuned: false,
      requires_attunement: false,
      quantity: 1,
    },
    {
      character_id: '',
      name: 'Chain Mail',
      item_type: 'armor',
      properties: ['AC 16'],
      is_equipped: true,
      is_attuned: false,
      requires_attunement: false,
      quantity: 1,
    },
  ];

  const powers: Power[] = [
    {
      character_id: '',
      name: 'Second Wind',
      power_level: 0,
      source: 'Job',
      is_prepared: true,
      is_known: true,
      casting_time: '1 bonus action',
      range: 'Self',
      duration: 'Instantaneous',
      concentration: false,
    },
  ];

  const features: Feature[] = [
    {
      character_id: '',
      name: 'Action Surge',
      level_acquired: 2,
      source: 'Job',
      uses_current: 1,
      uses_max: 1,
      recharge: 'short-rest',
      action_type: 'action',
      is_active: true,
    },
    {
      character_id: '',
      name: 'Extra Attack',
      level_acquired: 5,
      source: 'Job',
      uses_current: null,
      uses_max: null,
      recharge: null,
      action_type: 'passive',
      is_active: true,
    },
  ];

  return { character, equipment, powers, features };
}

/**
 * Create a caster character (mage-type) for testing
 * - High INT
 * - Spell-focused
 * - Spell slots
 * - Cast flow and rest resets
 */
export function createCasterCharacter(): {
  character: CharacterInsert;
  equipment: Equipment[];
  powers: Power[];
  features: Feature[];
} {
  const character: CharacterInsert = {
    user_id: 'test-user-id', // Required field for test fixtures
    name: 'Test Mage',
    level: 5,
    job: 'Mage',
    path: 'Evocation',
    background: 'Sage',
    proficiency_bonus: 3,
    armor_class: 12,
    speed: 30,
    initiative: 2,
    hp_current: 32,
    hp_max: 32,
    hp_temp: 0,
    hit_dice_current: 5,
    hit_dice_max: 5,
    hit_dice_size: 6,
    system_favor_current: 3,
    system_favor_max: 3,
    system_favor_die: 6,
    saving_throw_proficiencies: ['INT', 'PRE'],
    skill_proficiencies: ['Arcana', 'History', 'Investigation', 'Religion'],
    skill_expertise: [],
    armor_proficiencies: [],
    weapon_proficiencies: ['simple'],
    tool_proficiencies: [],
    conditions: [],
    exhaustion_level: 0,
  };

  const equipment: Equipment[] = [
    {
      character_id: '',
      name: 'Quarterstaff',
      item_type: 'weapon',
      properties: [],
      is_equipped: true,
      is_attuned: false,
      requires_attunement: false,
      quantity: 1,
    },
    {
      character_id: '',
      name: 'Spellbook',
      item_type: 'gear',
      properties: [],
      is_equipped: false,
      is_attuned: false,
      requires_attunement: false,
      quantity: 1,
    },
  ];

  const powers: Power[] = [
    {
      character_id: '',
      name: 'Fireball',
      power_level: 3,
      source: 'Job',
      is_prepared: true,
      is_known: true,
      casting_time: '1 action',
      range: '150 feet',
      duration: 'Instantaneous',
      concentration: false,
    },
    {
      character_id: '',
      name: 'Magic Missile',
      power_level: 1,
      source: 'Job',
      is_prepared: true,
      is_known: true,
      casting_time: '1 action',
      range: '120 feet',
      duration: 'Instantaneous',
      concentration: false,
    },
  ];

  const features: Feature[] = [
    {
      character_id: '',
      name: 'Spellcasting',
      level_acquired: 1,
      source: 'Job',
      uses_current: null,
      uses_max: null,
      recharge: null,
      action_type: 'passive',
      is_active: true,
    },
    {
      character_id: '',
      name: 'Arcane Recovery',
      level_acquired: 1,
      source: 'Job',
      uses_current: 1,
      uses_max: 1,
      recharge: 'long-rest',
      action_type: 'action',
      is_active: true,
    },
  ];

  return { character, equipment, powers, features };
}

/**
 * Create a hybrid character for testing
 * - Mixed stats
 * - Conditions + equipment + roll modifiers
 * - Complex interactions
 */
export function createHybridCharacter(): {
  character: CharacterInsert;
  equipment: Equipment[];
  powers: Power[];
  features: Feature[];
} {
  const character: CharacterInsert = {
    user_id: 'test-user-id', // Required field for test fixtures
    name: 'Test Ranger',
    level: 3,
    job: 'Ranger',
    path: 'Beast Master',
    background: 'Outlander',
    proficiency_bonus: 2,
    armor_class: 15,
    speed: 30,
    initiative: 3,
    hp_current: 28,
    hp_max: 28,
    hp_temp: 0,
    hit_dice_current: 3,
    hit_dice_max: 3,
    hit_dice_size: 10,
    system_favor_current: 3,
    system_favor_max: 3,
    system_favor_die: 4,
    saving_throw_proficiencies: ['STR', 'AGI'],
    skill_proficiencies: ['Animal Handling', 'Nature', 'Perception', 'Survival', 'Stealth'],
    skill_expertise: [],
    armor_proficiencies: ['light', 'medium', 'shields'],
    weapon_proficiencies: ['simple', 'martial'],
    tool_proficiencies: [],
    conditions: ['poisoned'], // Has a condition
    exhaustion_level: 0,
  };

  const equipment: Equipment[] = [
    {
      character_id: '',
      name: 'Longbow',
      item_type: 'weapon',
      properties: ['+1 to attack'],
      is_equipped: true,
      is_attuned: false,
      requires_attunement: false,
      quantity: 1,
    },
    {
      character_id: '',
      name: 'Leather Armor',
      item_type: 'armor',
      properties: ['AC 11'],
      is_equipped: true,
      is_attuned: false,
      requires_attunement: false,
      quantity: 1,
    },
    {
      character_id: '',
      name: 'Ring of Protection',
      item_type: 'relic',
      properties: ['+1 AC', '+1 to saving throws'],
      is_equipped: true,
      is_attuned: true,
      requires_attunement: true,
      quantity: 1,
    },
  ];

  const powers: Power[] = [
    {
      character_id: '',
      name: 'Hunter\'s Mark',
      power_level: 1,
      source: 'Job',
      is_prepared: true,
      is_known: true,
      casting_time: '1 bonus action',
      range: '90 feet',
      duration: '1 hour',
      concentration: true,
    },
  ];

  const features: Feature[] = [
    {
      character_id: '',
      name: 'Favored Enemy',
      level_acquired: 1,
      source: 'Job',
      uses_current: null,
      uses_max: null,
      recharge: null,
      action_type: 'passive',
      is_active: true,
    },
    {
      character_id: '',
      name: 'Natural Explorer',
      level_acquired: 1,
      source: 'Job',
      uses_current: null,
      uses_max: null,
      recharge: null,
      action_type: 'passive',
      is_active: true,
    },
  ];

  return { character, equipment, powers, features };
}

