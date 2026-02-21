/**
 * Free Audio Library Manager
 * Comprehensive management of 100% free audio/music assets for DMs
 * Organizes and provides easy access to all audio content
 */

import { BUILTIN_AUDIO_CATALOG, BUILTIN_AUDIO_CATEGORIES, searchBuiltinAudio } from '@/data/builtinAudioCatalog';
import type { AudioTrack } from '@/lib/audio/types';

// Audio mood classifications for enhanced filtering
export const AUDIO_MOODS = {
  EPIC: ['epic', 'heroic', 'triumph', 'glory', 'battle'],
  TENSE: ['tense', 'dramatic', 'suspense', 'dark', 'horror'],
  PEACEFUL: ['peaceful', 'calm', 'serene', 'gentle', 'quiet'],
  MYSTERIOUS: ['mysterious', 'enigmatic', 'puzzle', 'investigation', 'ancient'],
  JOYFUL: ['joyful', 'celebration', 'festive', 'lively', 'upbeat'],
  SOMBER: ['somber', 'sad', 'melancholy', 'emotional', 'funeral'],
  SACRED: ['sacred', 'divine', 'holy', 'spiritual', 'heavenly'],
  NATURE: ['nature', 'forest', 'rain', 'ocean', 'wind', 'mountain'],
  COMBAT: ['combat', 'battle', 'fight', 'war', 'skirmish'],
  MAGIC: ['magical', 'arcane', 'mystical', 'enchantment', 'spell'],
} as const;

// Audio use-case scenarios for DMs
export const AUDIO_SCENARIOS: Record<string, string[]> = {
  COMBAT_START: ['combat-epic-1', 'combat-intense-1', 'combat-dragon-1'],
  COMBAT_BOSS: ['combat-boss-1', 'combat-dragon-1', 'combat-siege-1'],
  EXPLORATION_DUNGEON: ['explore-dungeon-1', 'explore-cave-1', 'ambient-cave-1'],
  EXPLORATION_FOREST: ['explore-forest-1', 'ambient-forest-1', 'ambient-river-1'],
  EXPLORATION_CITY: ['social-market-1', 'ambient-city-1', 'social-tavern-1'],
  SOCIAL_TAVERN: ['social-tavern-1', 'ambient-tavern-1', 'social-festival-1'],
  SOCIAL_NOBLE: ['social-noble-1', 'social-feast-1', 'sacred-temple-1'],
  HORROR_AMBIENT: ['horror-dread-1', 'ambient-rain-1', 'horror-whispers-1'],
  HORROR_COMBAT: ['horror-monster-1', 'combat-undead-1', 'horror-cult-1'],
  MYSTERY_INVESTIGATION: ['mystery-clues-1', 'mystery-detective-1', 'mystery-ancient-1'],
  VICTORY_CELEBRATION: ['victory-epic-1', 'victory-triumph-1', 'social-festival-1'],
  EMOTIONAL_SCENES: ['sad-funeral-1', 'sad-loss-1', 'sad-melancholy-1'],
  DIVINE_ENCOUNTERS: ['sacred-temple-1', 'sacred-choir-1', 'divine-ritual-1'],
};

// Sound effect collections for common actions
export const SOUND_EFFECTS: Record<string, string[]> = {
  DOORS: ['sfx-door-creak-1'],
  COMBAT: ['sfx-sword-clash-1', 'sfx-monster-roar-1', 'sfx-dragon-breath-1'],
  MAGIC: ['sfx-fireball-1', 'sfx-healing-1', 'sfx-teleport-1'],
  NATURE: ['ambient-thunder-1', 'ambient-rain-1', 'ambient-wind-1'],
  HORROR: ['sfx-zombie-groan-1', 'horror-whispers-1', 'horror-graveyard-1'],
  CELEBRATION: ['victory-epic-1', 'social-festival-1'],
};

// Audio library manager class
export class FreeAudioLibraryManager {
  private tracks: AudioTrack[];
  
  constructor() {
    this.tracks = BUILTIN_AUDIO_CATALOG;
  }

  // Get all tracks
  getAllTracks(): AudioTrack[] {
    return this.tracks;
  }

  // Get tracks by category
  getTracksByCategory(category: string): AudioTrack[] {
    return BUILTIN_AUDIO_CATEGORIES[category as keyof typeof BUILTIN_AUDIO_CATEGORIES] || [];
  }

  // Get tracks by mood
  getTracksByMood(mood: keyof typeof AUDIO_MOODS): AudioTrack[] {
    const moodTags = AUDIO_MOODS[mood];
    return this.tracks.filter(track => 
      moodTags.some(tag => 
        track.tags.includes(tag) || 
        track.mood?.toLowerCase().includes(tag.toLowerCase())
      )
    );
  }

  // Get scenario-specific tracks
  getScenarioTracks(scenario: string): AudioTrack[] {
    const trackIds = AUDIO_SCENARIOS[scenario] || [];
    return this.tracks.filter(track => trackIds.includes(track.id.replace('builtin-', '')));
  }

  // Get sound effects by type
  getSoundEffects(type: string): AudioTrack[] {
    const effectIds = SOUND_EFFECTS[type] || [];
    return this.tracks.filter(track => 
      effectIds.includes(track.id.replace('builtin-', '')) && 
      track.category === 'sfx'
    );
  }

  // Search tracks with enhanced filtering
  searchTracks(query: string, options?: {
    category?: string;
    mood?: string;
    duration?: { min?: number; max?: number };
    tags?: string[];
  }): AudioTrack[] {
    let results = searchBuiltinAudio(query, options?.category);
    
    if (options?.mood) {
      const moodTags = AUDIO_MOODS[options.mood as keyof typeof AUDIO_MOODS] || [];
      results = results.filter(track =>
        moodTags.some(tag => 
          track.tags.includes(tag) || 
          track.mood?.toLowerCase().includes(tag.toLowerCase())
        )
      );
    }
    
    if (options?.duration) {
      results = results.filter(track => {
        const duration = track.duration;
        return (!options.duration?.min || duration >= options.duration.min) &&
               (!options.duration?.max || duration <= options.duration.max);
      });
    }
    
    if (options?.tags && options.tags.length > 0) {
      results = results.filter(track =>
        options.tags!.some(tag => track.tags.includes(tag))
      );
    }
    
    return results;
  }

  // Get random track from category
  getRandomTrack(category?: string): AudioTrack | null {
    const pool = category ? this.getTracksByCategory(category) : this.tracks;
    if (pool.length === 0) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  // Get playlist for specific session type
  getSessionPlaylist(sessionType: string): AudioTrack[] {
    const playlists: Record<string, AudioTrack[]> = {
      combat: [
        ...this.getScenarioTracks('COMBAT_START'),
        ...this.getScenarioTracks('COMBAT_BOSS'),
        ...this.getSoundEffects('COMBAT')
      ],
      exploration: [
        ...this.getScenarioTracks('EXPLORATION_DUNGEON'),
        ...this.getScenarioTracks('EXPLORATION_FOREST'),
        ...this.getScenarioTracks('EXPLORATION_CITY')
      ],
      social: [
        ...this.getScenarioTracks('SOCIAL_TAVERN'),
        ...this.getScenarioTracks('SOCIAL_NOBLE')
      ],
      horror: [
        ...this.getScenarioTracks('HORROR_AMBIENT'),
        ...this.getScenarioTracks('HORROR_COMBAT'),
        ...this.getSoundEffects('HORROR')
      ],
      mystery: [
        ...this.getScenarioTracks('MYSTERY_INVESTIGATION')
      ]
    };
    
    return playlists[sessionType] || [];
  }

  // Get statistics about the library
  getLibraryStats() {
    const stats = {
      totalTracks: this.tracks.length,
      categories: Object.keys(BUILTIN_AUDIO_CATEGORIES).length,
      moods: Object.keys(AUDIO_MOODS).length,
      scenarios: Object.keys(AUDIO_SCENARIOS).length,
      soundEffects: this.tracks.filter(t => t.category === 'sfx').length,
      musicTracks: this.tracks.filter(t => ['music', 'combat', 'exploration', 'social', 'horror', 'mystery', 'victory', 'sad', 'sacred'].includes(t.category)).length,
      ambientTracks: this.tracks.filter(t => t.category === 'ambient').length,
    };
    
    return stats;
  }

  // Get recommended tracks for current situation
  getRecommendations(context: {
    situation: string;
    timeOfDay?: string;
    weather?: string;
    mood?: string;
  }): AudioTrack[] {
    let recommendations: AudioTrack[] = [];
    
    // Base recommendations by situation
    switch (context.situation) {
      case 'combat':
        recommendations = [...this.getTracksByCategory('combat'), ...this.getSoundEffects('COMBAT')];
        break;
      case 'exploration':
        recommendations = [...this.getTracksByCategory('exploration'), ...this.getTracksByCategory('ambient')];
        break;
      case 'social':
        recommendations = [...this.getTracksByCategory('social')];
        break;
      case 'rest':
        recommendations = [...this.getTracksByMood('PEACEFUL'), ...this.getTracksByCategory('ambient')];
        break;
      case 'travel':
        recommendations = [...this.getScenarioTracks('EXPLORATION_FOREST'), ...this.getScenarioTracks('EXPLORATION_CITY')];
        break;
    }
    
    // Filter by mood if specified
    if (context.mood) {
      const moodTracks = this.getTracksByMood(context.mood.toUpperCase() as keyof typeof AUDIO_MOODS);
      recommendations = recommendations.filter(track => 
        moodTracks.includes(track) || 
        track.mood?.toLowerCase().includes(context.mood!.toLowerCase())
      );
    }
    
    // Add weather effects if specified
    if (context.weather) {
      const weatherTracks = this.tracks.filter(track => 
        track.tags.includes(context.weather!) ||
        track.title.toLowerCase().includes(context.weather!)
      );
      recommendations.push(...weatherTracks);
    }
    
    return recommendations.slice(0, 10); // Return top 10 recommendations
  }
}

// Singleton instance
export const freeAudioLibrary = new FreeAudioLibraryManager();

// Helper functions for common use cases
export function getCombatMusic(): AudioTrack[] {
  return freeAudioLibrary.getTracksByCategory('combat');
}

export function getAmbientSounds(): AudioTrack[] {
  return freeAudioLibrary.getTracksByCategory('ambient');
}

export function getSocialMusic(): AudioTrack[] {
  return freeAudioLibrary.getTracksByCategory('social');
}

export function getHorrorAmbience(): AudioTrack[] {
  return freeAudioLibrary.getTracksByCategory('horror');
}

export function getSoundEffects(): AudioTrack[] {
  return freeAudioLibrary.getTracksByCategory('sfx');
}

export function getVictoryMusic(): AudioTrack[] {
  return freeAudioLibrary.getTracksByCategory('victory');
}

export function getSadMusic(): AudioTrack[] {
  return freeAudioLibrary.getTracksByCategory('sad');
}

export function getSacredMusic(): AudioTrack[] {
  return freeAudioLibrary.getTracksByCategory('sacred');
}

// Quick access functions for DMs
export function quickPlayCombat(trackId?: string): AudioTrack | null {
  const track = trackId 
    ? freeAudioLibrary.getAllTracks().find(t => t.id === trackId)
    : freeAudioLibrary.getRandomTrack('combat');
  return track || null;
}

export function quickPlayAmbient(trackId?: string): AudioTrack | null {
  const track = trackId 
    ? freeAudioLibrary.getAllTracks().find(t => t.id === trackId)
    : freeAudioLibrary.getRandomTrack('ambient');
  return track || null;
}

export function quickPlaySocial(trackId?: string): AudioTrack | null {
  const track = trackId 
    ? freeAudioLibrary.getAllTracks().find(t => t.id === trackId)
    : freeAudioLibrary.getRandomTrack('social');
  return track || null;
}
