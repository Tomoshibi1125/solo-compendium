/**
 * Free VTT Asset Library Manager
 * Comprehensive management of 100% free VTT tokens/maps/assets for DMs
 * Organizes and provides easy access to all visual content
 */

import { VTT_ASSET_LIBRARY, VTT_ASSET_CATEGORIES, searchAssets, type VTTAsset, type VTTAssetCategory } from '@/data/vttAssetLibrary';

// Asset use-case scenarios for DMs
export const VTT_SCENARIOS: Record<string, string[]> = {
  COMBAT_ENCOUNTER: ['monster', 'weapon', 'effect', 'token'],
  SOCIAL_INTERACTION: ['npc', 'portrait', 'prop', 'building'],
  DUNGEON_EXPLORATION: ['map', 'prop', 'environment', 'condition'],
  CITY_EXPLORATION: ['building', 'npc', 'vehicle', 'prop'],
  WILDERNESS_TRAVEL: ['environment', 'creature', 'nature', 'building'],
  DIVINE_ENCOUNTER: ['divine', 'magical', 'portrait', 'effect'],
  HORROR_SCENARIO: ['shadow', 'monster', 'environment', 'condition'],
  COSMIC_ADVENTURE: ['cosmic', 'magical', 'elemental', 'creature'],
  MECHANICAL_DUNGEON: ['mechanical', 'prop', 'building', 'armor'],
  ARCANE_LIBRARY: ['magical', 'spell', 'prop', 'npc'],
};

// Asset collections by theme
export const VTT_THEMES: Record<string, string[]> = {
  FANTASY_CLASSIC: ['monster', 'weapon', 'armor', 'building', 'npc'],
  SCI_FI_SPACE: ['cosmic', 'mechanical', 'vehicle', 'creature'],
  HORROR_GOTHIC: ['shadow', 'monster', 'building', 'condition'],
  NATURE_PRIMAL: ['environment', 'creature', 'nature', 'elemental'],
  DIVINE_CELESTIAL: ['divine', 'magical', 'portrait', 'effect'],
  STEAMPUNK: ['mechanical', 'vehicle', 'prop', 'building'],
  MYSTICAL_ARCANE: ['magical', 'spell', 'elemental', 'cosmic'],
};

// Asset size classifications for tokens
export const TOKEN_SIZES: Record<string, string[]> = {
  TINY: ['creature-small', 'npc-child', 'prop-small'],
  SMALL: ['creature-medium', 'npc-commoner', 'weapon-dagger'],
  MEDIUM: ['creature-large', 'npc-adult', 'weapon-sword', 'monster-medium'],
  LARGE: ['creature-huge', 'monster-large', 'vehicle-cart'],
  HUGE: ['creature-gargantuan', 'monster-huge', 'vehicle-ship', 'building-small'],
  GARGANTUAN: ['monster-colossal', 'building-large', 'cosmic-planetary'],
};

// VTT asset library manager class
export class FreeVTTAssetLibraryManager {
  private assets: VTTAsset[];
  
  constructor() {
    this.assets = VTT_ASSET_LIBRARY;
  }

  // Get all assets
  getAllAssets(): VTTAsset[] {
    return this.assets;
  }

  // Get assets by category
  getAssetsByCategory(category: VTTAssetCategory): VTTAsset[] {
    return this.assets.filter(asset => asset.category === category);
  }

  // Get assets by scenario
  getScenarioAssets(scenario: string): VTTAsset[] {
    const categories = VTT_SCENARIOS[scenario] || [];
    return this.assets.filter(asset => categories.includes(asset.category));
  }

  // Get assets by theme
  getThemeAssets(theme: string): VTTAsset[] {
    const categories = VTT_THEMES[theme] || [];
    return this.assets.filter(asset => categories.includes(asset.category));
  }

  // Get token assets by size
  getTokensBySize(size: string): VTTAsset[] {
    const sizeTags = TOKEN_SIZES[size] || [];
    return this.assets.filter(asset => 
      asset.category === 'token' || 
      asset.category === 'monster' || 
      asset.category === 'creature' ||
      asset.category === 'npc' ||
      asset.category === 'portrait'
    ).filter(asset => 
      sizeTags.some(tag => asset.tags.includes(tag))
    );
  }

  // Search assets with enhanced filtering
  searchAssets(query: string, options?: {
    category?: VTTAssetCategory;
    tags?: string[];
    rank?: string;
    excludeCategories?: VTTAssetCategory[];
  }): VTTAsset[] {
    let results = searchAssets(query, options?.category);
    
    if (options?.tags && options.tags.length > 0) {
      results = results.filter(asset =>
        options.tags!.some(tag => asset.tags.includes(tag))
      );
    }
    
    if (options?.rank) {
      results = results.filter(asset => asset.rank === options.rank);
    }
    
    if (options?.excludeCategories && options.excludeCategories.length > 0) {
      results = results.filter(asset => 
        !options.excludeCategories!.includes(asset.category)
      );
    }
    
    return results;
  }

  // Get random asset from category
  getRandomAsset(category?: VTTAssetCategory): VTTAsset | null {
    const pool = category ? this.getAssetsByCategory(category) : this.assets;
    if (pool.length === 0) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  // Get assets for specific encounter type
  getEncounterAssets(encounterType: string): VTTAsset[] {
    const encounters: Record<string, VTTAsset[]> = {
      combat: [
        ...this.getScenarioAssets('COMBAT_ENCOUNTER'),
        ...this.getAssetsByCategory('effect'),
        ...this.getAssetsByCategory('condition')
      ],
      social: [
        ...this.getScenarioAssets('SOCIAL_INTERACTION'),
        ...this.getAssetsByCategory('prop')
      ],
      exploration: [
        ...this.getScenarioAssets('DUNGEON_EXPLORATION'),
        ...this.getScenarioAssets('WILDERNESS_TRAVEL'),
        ...this.getAssetsByCategory('environment')
      ],
      puzzle: [
        ...this.getAssetsByCategory('prop'),
        ...this.getAssetsByCategory('magical'),
        ...this.getAssetsByCategory('mechanical')
      ],
      boss: [
        ...this.getAssetsByCategory('monster'),
        ...this.getAssetsByCategory('effect'),
        ...this.getAssetsByCategory('environment'),
        ...this.getThemeAssets('FANTASY_CLASSIC')
      ]
    };
    
    return encounters[encounterType] || [];
  }

  // Get map assets for different environments
  getEnvironmentMaps(environment: string): VTTAsset[] {
    const environments: Record<string, VTTAsset[]> = {
      dungeon: [
        ...this.getAssetsByCategory('map'),
        ...this.getAssetsByCategory('prop'),
        ...this.getAssetsByCategory('building')
      ],
      city: [
        ...this.getAssetsByCategory('building'),
        ...this.getAssetsByCategory('npc'),
        ...this.getAssetsByCategory('vehicle')
      ],
      wilderness: [
        ...this.getAssetsByCategory('environment'),
        ...this.getAssetsByCategory('creature'),
        ...this.getAssetsByCategory('nature')
      ],
      cosmic: [
        ...this.getAssetsByCategory('cosmic'),
        ...this.getAssetsByCategory('elemental'),
        ...this.getAssetsByCategory('magical')
      ],
      horror: [
        ...this.getAssetsByCategory('shadow'),
        ...this.getAssetsByCategory('monster'),
        ...this.getAssetsByCategory('condition')
      ]
    };
    
    return environments[environment] || [];
  }

  // Get token assets for party members
  getPartyTokens(partyComposition: {
    warriors?: number;
    mages?: number;
    rogues?: number;
    clerics?: number;
    rangers?: number;
    others?: number;
  }): VTTAsset[] {
    const tokens: VTTAsset[] = [];
    
    // Add warrior tokens
    for (let i = 0; i < (partyComposition.warriors || 0); i++) {
      const warriorToken = this.getRandomAsset('portrait');
      if (warriorToken) tokens.push(warriorToken);
    }
    
    // Add mage tokens
    for (let i = 0; i < (partyComposition.mages || 0); i++) {
      const mageToken = this.searchAssets('mage staff', { category: 'portrait' })[0] || this.getRandomAsset('portrait');
      if (mageToken) tokens.push(mageToken);
    }
    
    // Add rogue tokens
    for (let i = 0; i < (partyComposition.rogues || 0); i++) {
      const rogueToken = this.searchAssets('rogue dagger', { category: 'portrait' })[0] || this.getRandomAsset('portrait');
      if (rogueToken) tokens.push(rogueToken);
    }
    
    // Add cleric tokens
    for (let i = 0; i < (partyComposition.clerics || 0); i++) {
      const clericToken = this.searchAssets('cleric holy', { category: 'portrait' })[0] || this.getRandomAsset('portrait');
      if (clericToken) tokens.push(clericToken);
    }
    
    // Add ranger tokens
    for (let i = 0; i < (partyComposition.rangers || 0); i++) {
      const rangerToken = this.searchAssets('ranger bow', { category: 'portrait' })[0] || this.getRandomAsset('portrait');
      if (rangerToken) tokens.push(rangerToken);
    }
    
    // Add other tokens
    for (let i = 0; i < (partyComposition.others || 0); i++) {
      const otherToken = this.getRandomAsset('portrait');
      if (otherToken) tokens.push(otherToken);
    }
    
    return tokens;
  }

  // Get statistics about the library
  getLibraryStats() {
    const stats = {
      totalAssets: this.assets.length,
      categories: VTT_ASSET_CATEGORIES.length,
      scenarios: Object.keys(VTT_SCENARIOS).length,
      themes: Object.keys(VTT_THEMES).length,
      tokenAssets: this.assets.filter(a => ['token', 'monster', 'creature', 'npc', 'portrait'].includes(a.category)).length,
      mapAssets: this.assets.filter(a => a.category === 'map').length,
      effectAssets: this.assets.filter(a => a.category === 'effect').length,
      itemAssets: this.assets.filter(a => ['item', 'weapon', 'armor', 'prop', 'magical'].includes(a.category)).length,
    };
    
    return stats;
  }

  // Get recommended assets for current situation
  getRecommendations(context: {
    situation: string;
    environment?: string;
    partySize?: number;
    difficulty?: string;
  }): VTTAsset[] {
    let recommendations: VTTAsset[] = [];
    
    // Base recommendations by situation
    switch (context.situation) {
      case 'combat':
        recommendations = [...this.getScenarioAssets('COMBAT_ENCOUNTER')];
        break;
      case 'exploration':
        recommendations = [...this.getScenarioAssets('DUNGEON_EXPLORATION')];
        break;
      case 'social':
        recommendations = [...this.getScenarioAssets('SOCIAL_INTERACTION')];
        break;
      case 'dungeon':
        recommendations = [...this.getScenarioAssets('DUNGEON_EXPLORATION')];
        break;
      case 'city':
        recommendations = [...this.getScenarioAssets('CITY_EXPLORATION')];
        break;
      case 'wilderness':
        recommendations = [...this.getScenarioAssets('WILDERNESS_TRAVEL')];
        break;
    }
    
    // Add environment-specific assets
    if (context.environment) {
      const envAssets = this.getEnvironmentMaps(context.environment);
      recommendations.push(...envAssets);
    }
    
    // Add difficulty-appropriate monsters
    if (context.difficulty && context.situation === 'combat') {
      const difficultyMonsters = this.assets.filter(asset => 
        asset.category === 'monster' && 
        (
          (context.difficulty === 'easy' && ['E', 'D'].includes(asset.rank || '')) ||
          (context.difficulty === 'medium' && ['C', 'B'].includes(asset.rank || '')) ||
          (context.difficulty === 'hard' && ['A', 'S'].includes(asset.rank || '')) ||
          (context.difficulty === 'deadly' && ['S', 'SS'].includes(asset.rank || ''))
        )
      );
      recommendations.push(...difficultyMonsters.slice(0, 3));
    }
    
    return recommendations.slice(0, 20); // Return top 20 recommendations
  }

  // Get assets suitable for handouts
  getHandoutAssets(type: string): VTTAsset[] {
    const handouts: Record<string, VTTAsset[]> = {
      item: [...this.getAssetsByCategory('item'), ...this.getAssetsByCategory('weapon'), ...this.getAssetsByCategory('armor')],
      document: [...this.getAssetsByCategory('handout'), ...this.getAssetsByCategory('magical')],
      map: [...this.getAssetsByCategory('map'), ...this.getAssetsByCategory('location')],
      portrait: [...this.getAssetsByCategory('portrait'), ...this.getAssetsByCategory('npc')]
    };
    
    return handouts[type] || [];
  }
}

// Singleton instance
export const freeVTTAssetLibrary = new FreeVTTAssetLibraryManager();

// Helper functions for common use cases
export function getCombatTokens(): VTTAsset[] {
  return freeVTTAssetLibrary.getScenarioAssets('COMBAT_ENCOUNTER');
}

export function getSocialNPCs(): VTTAsset[] {
  return freeVTTAssetLibrary.getScenarioAssets('SOCIAL_INTERACTION');
}

export function getDungeonProps(): VTTAsset[] {
  return freeVTTAssetLibrary.getScenarioAssets('DUNGEON_EXPLORATION');
}

export function getBattleMaps(): VTTAsset[] {
  return freeVTTAssetLibrary.getAssetsByCategory('map');
}

export function getMonsterTokens(): VTTAsset[] {
  return freeVTTAssetLibrary.getAssetsByCategory('monster');
}

export function getEffectOverlays(): VTTAsset[] {
  return freeVTTAssetLibrary.getAssetsByCategory('effect');
}

// Quick access functions for DMs
export function quickRandomMonster(): VTTAsset | null {
  return freeVTTAssetLibrary.getRandomAsset('monster');
}

export function quickRandomNPC(): VTTAsset | null {
  return freeVTTAssetLibrary.getRandomAsset('npc');
}

export function quickRandomEffect(): VTTAsset | null {
  return freeVTTAssetLibrary.getRandomAsset('effect');
}

export function quickRandomMap(): VTTAsset | null {
  return freeVTTAssetLibrary.getRandomAsset('map');
}

export function quickRandomProp(): VTTAsset | null {
  return freeVTTAssetLibrary.getRandomAsset('prop');
}
