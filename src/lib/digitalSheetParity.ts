/**
 * Digital Character Sheet Parity Analysis - Character Sheet
 * 
 * Features to implement for full Digital Character Sheet parity:
 */

// 1. Inspiration System
interface CharacterInspiration {
  inspiration_points: number;
  inspiration_used: boolean;
}

// 2. Death Saves
interface DeathSaves {
  death_save_successes: number;
  death_save_failures: number;
  is_stable: boolean;
}

// 3. Spell Preparation (for prepared spellcasters)
interface SpellPreparation {
  prepared_spells: string[];
  max_prepared_spells: number;
}

// 4. Feature Management
interface CharacterFeatures {
  racial_traits: string[];
  class_features: string[];
  feat_features: string[];
  background_features: string[];
}

// 5. Custom Modifiers
interface CustomModifiers {
  custom_bonuses: {
    type: 'ability' | 'skill' | 'save' | 'attack' | 'damage' | 'ac' | 'speed';
    value: number;
    source: string;
    condition?: string;
  }[];
}

// 6. Temporary HP Management
interface TemporaryHP {
  temp_hp_sources: Array<{
    amount: number;
    source: string;
    duration?: number;
  }>;
}

// 7. Spell Points (alternative to spell slots)
interface SpellPoints {
  spell_points_current: number;
  spell_points_max: number;
}

// 8. Ki Points (for Monks)
interface KiPoints {
  ki_points_current: number;
  ki_points_max: number;
}

// 9. Sorcery Points (for Sorcerers)
interface SorceryPoints {
  sorcery_points_current: number;
  sorcery_points_max: number;
}

// 10. Superiority Dice (for Battle Masters)
interface SuperiorityDice {
  superiority_dice_current: number;
  superiority_dice_max: number;
  superiority_dice_size: number;
}

// 11. Bardic Inspiration
interface BardicInspiration {
  bardic_inspiration_current: number;
  bardic_inspiration_max: number;
  bardic_inspiration_die: number;
}

// 12. Rages (for Barbarians)
interface Rages {
  rages_current: number;
  rages_max: number;
  rage_damage: number;
}

// 13. Expertise Dice (for Rogues)
interface ExpertiseDice {
  expertise_dice_current: number;
  expertise_dice_max: number;
  expertise_dice_size: number;
}

// 14. Psionic Points (for Soulknives)
interface PsionicPoints {
  psionic_points_current: number;
  psionic_points_max: number;
}

// 15. Additional Features
interface AdditionalFeatures {
  fighting_style?: string;
  favored_enemy?: string[];
  natural_explorer?: string[];
  favored_terrain?: string[];
  divine_domain?: string;
  druid_circle?: string;
  martial_archetype?: string;
  monk_tradition?: string;
  oath?: string;
  patron?: string;
  sacred_weapon?: boolean;
  second_wind?: boolean;
  action_surge?: boolean;
}

