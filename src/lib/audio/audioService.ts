/**
 * Audio Player Service
 * Legal-safe sounds and music management for DMs
 */

import type { AudioTrack, Playlist, AudioPlayerState, AudioSettings } from './types';
import { DEFAULT_AUDIO_SETTINGS } from './types';
import { error } from '@/lib/logger';

export class AudioService {
  private audio: HTMLAudioElement | null = null;
  private state: AudioPlayerState = {
    currentTrack: null,
    isPlaying: false,
    volume: DEFAULT_AUDIO_SETTINGS.masterVolume,
    currentTime: 0,
    duration: 0,
    isLoading: false,
    error: null,
    playlist: null,
    currentTrackIndex: 0,
    repeat: 'none',
    shuffle: false,
  };
  private settings: AudioSettings = DEFAULT_AUDIO_SETTINGS;
  private listeners: Set<(state: AudioPlayerState) => void> = new Set();
  private fadeTimeout: NodeJS.Timeout | null = null;

  constructor() {
    // Load settings from localStorage
    this.loadSettings();
    
    // Initialize audio context
    if (typeof window !== 'undefined') {
      this.setupAudioElement();
    }
  }

  private setupAudioElement() {
    this.audio = new Audio();
    this.audio.preload = 'metadata';
    
    // Event listeners
    this.audio.addEventListener('loadstart', () => {
      this.updateState({ isLoading: true, error: null });
    });

    this.audio.addEventListener('loadeddata', () => {
      this.updateState({ 
        isLoading: false,
        duration: this.audio?.duration || 0,
      });
    });

    this.audio.addEventListener('timeupdate', () => {
      this.updateState({ 
        currentTime: this.audio?.currentTime || 0,
      });
    });

    this.audio.addEventListener('ended', () => {
      this.handleTrackEnd();
    });

    this.audio.addEventListener('error', (e) => {
      this.updateState({ 
        isLoading: false,
        error: 'Failed to load audio',
      });
    });

    this.audio.addEventListener('volumechange', () => {
      this.updateState({ 
        volume: this.audio?.volume || 0,
      });
    });
  }

  private updateState(updates: Partial<AudioPlayerState>) {
    this.state = { ...this.state, ...updates };
    this.notifyListeners();
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.state));
  }

  private handleTrackEnd() {
    const { repeat, playlist, currentTrackIndex } = this.state;
    
    if (repeat === 'one') {
      this.play();
    } else if (repeat === 'all' || (repeat === 'none' && playlist && currentTrackIndex < playlist.tracks.length - 1)) {
      this.next();
    } else {
      this.updateState({ isPlaying: false });
    }
  }

  // Public API
  async loadTrack(track: AudioTrack) {
    if (!this.audio) return;

    try {
      this.updateState({ isLoading: true, error: null });
      
      // Load the audio source
      if (track.isLocal && track.localPath) {
        this.audio.src = track.localPath;
      } else {
        this.audio.src = track.url;
      }
      
      // Set track properties
      this.audio.volume = track.volume * this.settings.masterVolume;
      this.audio.loop = track.loop;
      
      // Update state
      this.updateState({ 
        currentTrack: track,
        error: null,
      });
      
      // Load metadata
      await this.audio.load();
      
    } catch (error) {
      this.updateState({ 
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load track',
      });
    }
  }

  async play() {
    if (!this.audio || !this.state.currentTrack) return;

    try {
      await this.audio.play();
      this.updateState({ isPlaying: true });
    } catch (error) {
      this.updateState({ 
        error: error instanceof Error ? error.message : 'Failed to play',
      });
    }
  }

  pause() {
    if (!this.audio) return;
    
    this.audio.pause();
    this.updateState({ isPlaying: false });
  }

  stop() {
    if (!this.audio) return;
    
    this.audio.pause();
    this.audio.currentTime = 0;
    this.updateState({ 
      isPlaying: false,
      currentTime: 0,
    });
  }

  async next() {
    const { playlist, currentTrackIndex, shuffle } = this.state;
    
    if (!playlist || playlist.tracks.length === 0) return;
    
    let nextIndex = currentTrackIndex;
    
    if (shuffle) {
      // Get random index that's not the current one
      do {
        nextIndex = Math.floor(Math.random() * playlist.tracks.length);
      } while (nextIndex === currentTrackIndex && playlist.tracks.length > 1);
    } else {
      nextIndex = (currentTrackIndex + 1) % playlist.tracks.length;
    }
    
    this.updateState({ currentTrackIndex: nextIndex });
    // Load next track (would need track data from playlist)
  }

  async previous() {
    const { playlist, currentTrackIndex, shuffle } = this.state;
    
    if (!playlist || playlist.tracks.length === 0) return;
    
    let prevIndex = currentTrackIndex;
    
    if (shuffle) {
      // Get random index that's not the current one
      do {
        prevIndex = Math.floor(Math.random() * playlist.tracks.length);
      } while (prevIndex === currentTrackIndex && playlist.tracks.length > 1);
    } else {
      prevIndex = currentTrackIndex === 0 ? playlist.tracks.length - 1 : currentTrackIndex - 1;
    }
    
    this.updateState({ currentTrackIndex: prevIndex });
    // Load previous track (would need track data from playlist)
  }

  setVolume(volume: number) {
    if (!this.audio) return;
    
    const clampedVolume = Math.max(0, Math.min(1, volume));
    this.audio.volume = clampedVolume;
    this.updateState({ volume: clampedVolume });
  }

  setMasterVolume(volume: number) {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    this.settings.masterVolume = clampedVolume;
    this.saveSettings();
    
    if (this.audio && this.state.currentTrack) {
      this.audio.volume = this.state.currentTrack.volume * clampedVolume;
    }
  }

  setCurrentTime(time: number) {
    if (!this.audio) return;
    
    this.audio.currentTime = time;
    this.updateState({ currentTime: time });
  }

  setRepeat(repeat: 'none' | 'one' | 'all') {
    this.updateState({ repeat });
  }

  setShuffle(shuffle: boolean) {
    this.updateState({ shuffle });
  }

  // Playlist management
  loadPlaylist(playlist: Playlist, startIndex = 0) {
    this.updateState({ 
      playlist,
      currentTrackIndex: startIndex,
    });
    
    // Load the first track (would need track data from playlist)
  }

  // Volume fading
  fadeIn(duration = 2000, targetVolume?: number) {
    if (!this.audio || !this.state.currentTrack) return;
    
    const startVolume = this.audio.volume;
    const target = targetVolume ?? (this.state.currentTrack.volume * this.settings.masterVolume);
    const steps = 20;
    const stepDuration = duration / steps;
    const stepVolume = (target - startVolume) / steps;
    
    let currentStep = 0;
    
    this.clearFadeTimeout();
    
    const fadeInterval = setInterval(() => {
      currentStep++;
      const newVolume = startVolume + (stepVolume * currentStep);
      
      if (currentStep >= steps || newVolume >= target) {
        this.audio.volume = target;
        clearInterval(fadeInterval);
      } else {
        this.audio.volume = newVolume;
      }
    }, stepDuration);
    
    this.fadeTimeout = setTimeout(() => {
      clearInterval(fadeInterval);
    }, duration);
  }

  fadeOut(duration = 2000) {
    if (!this.audio) return;
    
    const startVolume = this.audio.volume;
    const steps = 20;
    const stepDuration = duration / steps;
    const stepVolume = startVolume / steps;
    
    let currentStep = 0;
    
    this.clearFadeTimeout();
    
    const fadeInterval = setInterval(() => {
      currentStep++;
      const newVolume = startVolume - (stepVolume * currentStep);
      
      if (currentStep >= steps || newVolume <= 0) {
        this.audio.volume = 0;
        clearInterval(fadeInterval);
        if (this.state.isPlaying) {
          this.pause();
        }
      } else {
        this.audio.volume = newVolume;
      }
    }, stepDuration);
    
    this.fadeTimeout = setTimeout(() => {
      clearInterval(fadeInterval);
    }, duration);
  }

  private clearFadeTimeout() {
    if (this.fadeTimeout) {
      clearTimeout(this.fadeTimeout);
      this.fadeTimeout = null;
    }
  }

  // Settings management
  private loadSettings() {
    if (typeof window === 'undefined') return;
    
    try {
      const saved = localStorage.getItem('audio-settings');
      if (saved) {
        this.settings = { ...DEFAULT_AUDIO_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (error) {
      error('Failed to load audio settings:', error);
    }
  }

  private saveSettings() {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem('audio-settings', JSON.stringify(this.settings));
    } catch (error) {
      error('Failed to save audio settings:', error);
    }
  }

  updateSettings(updates: Partial<AudioSettings>) {
    this.settings = { ...this.settings, ...updates };
    this.saveSettings();
    
    // Apply master volume change immediately
    if (updates.masterVolume !== undefined && this.audio && this.state.currentTrack) {
      this.audio.volume = this.state.currentTrack.volume * updates.masterVolume;
    }
  }

  getSettings(): AudioSettings {
    return { ...this.settings };
  }

  getState(): AudioPlayerState {
    return { ...this.state };
  }

  // Event listeners
  subscribe(listener: (state: AudioPlayerState) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Cleanup
  destroy() {
    this.clearFadeTimeout();
    this.listeners.clear();
    
    if (this.audio) {
      this.audio.pause();
      this.audio.src = '';
      this.audio = null;
    }
  }
}

// Singleton instance
export const audioService = new AudioService();
