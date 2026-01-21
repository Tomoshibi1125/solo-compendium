/**
 * Audio System Types
 * Legal safe sounds and music integration for Wardens
 */

import { z } from 'zod';

// Audio track types
export const AudioTrackSchema = z.object({
  id: z.string(),
  title: z.string(),
  artist: z.string(),
  category: z.enum(['music', 'ambient', 'effect', 'combat', 'exploration', 'social', 'horror', 'mystery']),
  duration: z.number(), // in seconds
  url: z.string(),
  localPath: z.string().optional(),
  volume: z.number().min(0).max(1).default(0.7),
  loop: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  mood: z.string().optional(),
  license: z.string(),
  source: z.string(), // e.g., 'YouTube Audio Library', 'FreeSound', 'Custom'
  isLocal: z.boolean().default(false),
  fileSize: z.number().optional(),
  mimeType: z.string().default('audio/mpeg'),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type AudioTrack = z.infer<typeof AudioTrackSchema>;

// Playlist types
export const PlaylistSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  tracks: z.array(z.string()), // track IDs
  category: z.enum(['combat', 'exploration', 'social', 'dungeon', 'city', 'wilderness', 'horror', 'custom']),
  autoPlay: z.boolean().default(false),
  shuffle: z.boolean().default(false),
  repeat: z.enum(['none', 'one', 'all']).default('none'),
  crossfade: z.number().min(0).max(10).default(2), // seconds
  volume: z.number().min(0).max(1).default(0.7),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Playlist = z.infer<typeof PlaylistSchema>;

// Audio player state
export interface AudioPlayerState {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  isLoading: boolean;
  error: string | null;
  playlist: Playlist | null;
  currentTrackIndex: number;
  repeat: 'none' | 'one' | 'all';
  shuffle: boolean;
}

// Sound effect categories
export const SOUND_CATEGORIES = {
  MUSIC: 'music',
  AMBIENT: 'ambient', 
  EFFECT: 'effect',
  COMBAT: 'combat',
  EXPLORATION: 'exploration',
  SOCIAL: 'social',
  HORROR: 'horror',
  MYSTERY: 'mystery',
} as const;

// Mood tags for filtering
export const MOOD_TAGS = [
  'epic', 'tense', 'mysterious', 'peaceful', 'dramatic', 'dark',
  'heroic', 'magical', 'ancient', 'industrial', 'nature', 'urban',
  'battle', 'stealth', 'investigation', 'celebration', 'somber'
] as const;

// Legal-safe audio sources
export const AUDIO_SOURCES = {
  YOUTUBE_AUDIO_LIBRARY: 'YouTube Audio Library',
  FREESOUND: 'FreeSound (CC0)',
  OPENGAMEART: 'OpenGameArt.org',
  ZAPSPLAT: 'Zapsplat (Free)',
  CUSTOM_UPLOAD: 'Custom Upload',
  BUILTIN: 'Built-in',
} as const;

// Default playlists for different scenarios
export const DEFAULT_PLAYLISTS = {
  COMBAT: {
    id: 'default-combat',
    name: 'Combat Music',
    description: 'Epic battle music for combat encounters',
    category: 'combat' as const,
    tracks: [], // Will be populated with available combat tracks
    autoPlay: true,
    shuffle: false,
    repeat: 'all' as const,
  },
  EXPLORATION: {
    id: 'default-exploration', 
    name: 'Exploration Music',
    description: 'Ambient music for dungeon exploration',
    category: 'exploration' as const,
    tracks: [],
    autoPlay: true,
    shuffle: true,
    repeat: 'all' as const,
  },
  SOCIAL: {
    id: 'default-social',
    name: 'Social Music',
    description: 'Background music for social encounters',
    category: 'social' as const,
    tracks: [],
    autoPlay: true,
    shuffle: true,
    repeat: 'all' as const,
  },
  HORROR: {
    id: 'default-horror',
    name: 'Horror Ambience',
    description: 'Spooky ambient sounds for horror scenarios',
    category: 'horror' as const,
    tracks: [],
    autoPlay: true,
    shuffle: false,
    repeat: 'all' as const,
  },
} as const;

// Audio settings
export interface AudioSettings {
  masterVolume: number;
  musicVolume: number;
  effectsVolume: number;
  crossfadeDuration: number;
  autoFadeOnCombat: boolean;
  autoFadeOnSocial: boolean;
  enableAmbientSounds: boolean;
}

// Default audio settings
export const DEFAULT_AUDIO_SETTINGS: AudioSettings = {
  masterVolume: 0.7,
  musicVolume: 0.7,
  effectsVolume: 0.8,
  crossfadeDuration: 2,
  autoFadeOnCombat: true,
  autoFadeOnSocial: true,
  enableAmbientSounds: true,
};

// Helper functions
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function getLicenseInfo(license: string): string {
  const licenseMap: Record<string, string> = {
    'CC0': 'Public Domain - No attribution required',
    'CC BY': 'Creative Commons - Attribution required',
    'CC BY-SA': 'Creative Commons - Attribution & ShareAlike',
    'YouTube': 'YouTube Audio Library - Free to use',
    'Custom': 'Custom uploaded content',
  };
  return licenseMap[license] || license;
}

export function isValidAudioFile(file: File): boolean {
  const validTypes = [
    'audio/mpeg',
    'audio/wav', 
    'audio/ogg',
    'audio/mp4',
    'audio/flac',
  ];
  return validTypes.includes(file.type);
}
