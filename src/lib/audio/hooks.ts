/**
 * Audio System React Hooks
 * React integration for the audio player service
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { audioService } from './audioService';
import type { AudioTrack, Playlist, AudioPlayerState, AudioSettings } from './types';
import { AppError } from '@/lib/appError';

/**
 * Hook for accessing audio player state and controls
 */
export function useAudioPlayer() {
  const [state, setState] = useState<AudioPlayerState>(audioService.getState());
  const [settings, setSettings] = useState<AudioSettings>(audioService.getSettings());

  useEffect(() => {
    const unsubscribe = audioService.subscribe(setState);
    return () => {
      unsubscribe();
    };
  }, []);

  const loadTrack = useCallback(async (track: AudioTrack) => {
    await audioService.loadTrack(track);
  }, []);

  const play = useCallback(async () => {
    await audioService.play();
  }, []);

  const pause = useCallback(() => {
    audioService.pause();
  }, []);

  const stop = useCallback(() => {
    audioService.stop();
  }, []);

  const next = useCallback(async () => {
    await audioService.next();
  }, []);

  const previous = useCallback(async () => {
    await audioService.previous();
  }, []);

  const setVolume = useCallback((volume: number) => {
    audioService.setVolume(volume);
  }, []);

  const setMasterVolume = useCallback((volume: number) => {
    audioService.setMasterVolume(volume);
    setSettings(audioService.getSettings());
  }, []);

  const setCurrentTime = useCallback((time: number) => {
    audioService.setCurrentTime(time);
  }, []);

  const setRepeat = useCallback((repeat: 'none' | 'one' | 'all') => {
    audioService.setRepeat(repeat);
  }, []);

  const setShuffle = useCallback((shuffle: boolean) => {
    audioService.setShuffle(shuffle);
  }, []);

  const loadPlaylist = useCallback((playlist: Playlist, startIndex?: number) => {
    audioService.loadPlaylist(playlist, startIndex);
  }, []);

  const fadeIn = useCallback((duration?: number, targetVolume?: number) => {
    audioService.fadeIn(duration, targetVolume);
  }, []);

  const fadeOut = useCallback((duration?: number) => {
    audioService.fadeOut(duration);
  }, []);

  const updateSettings = useCallback((updates: Partial<AudioSettings>) => {
    audioService.updateSettings(updates);
    setSettings(audioService.getSettings());
  }, []);

  return {
    // State
    state,
    settings,
    
    // Controls
    loadTrack,
    play,
    pause,
    stop,
    next,
    previous,
    setVolume,
    setMasterVolume,
    setCurrentTime,
    setRepeat,
    setShuffle,
    loadPlaylist,
    fadeIn,
    fadeOut,
    updateSettings,
    
    // Computed values
    isPlaying: state.isPlaying,
    isLoading: state.isLoading,
    currentTrack: state.currentTrack,
    currentTime: state.currentTime,
    duration: state.duration,
    volume: state.volume,
    error: state.error,
    playlist: state.playlist,
    repeat: state.repeat,
    shuffle: state.shuffle,
  };
}

/**
 * Hook for managing audio library
 */
export function useAudioLibrary() {
  const [tracks, setTracks] = useState<AudioTrack[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load library data
  const loadLibrary = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would load from your database
      // For now, we'll use mock data or localStorage
      const savedTracks = localStorage.getItem('audio-tracks');
      const savedPlaylists = localStorage.getItem('audio-playlists');
      
      if (savedTracks) {
        setTracks(JSON.parse(savedTracks));
      }
      
      if (savedPlaylists) {
        setPlaylists(JSON.parse(savedPlaylists));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load library');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save tracks
  const saveTracks = useCallback((newTracks: AudioTrack[]) => {
    setTracks(newTracks);
    try {
      localStorage.setItem('audio-tracks', JSON.stringify(newTracks));
    } catch (error) {
      console.error('Failed to save tracks:', error);
    }
  }, []);

  // Save playlists
  const savePlaylists = useCallback((newPlaylists: Playlist[]) => {
    setPlaylists(newPlaylists);
    try {
      localStorage.setItem('audio-playlists', JSON.stringify(newPlaylists));
    } catch (error) {
      console.error('Failed to save playlists:', error);
    }
  }, []);

  // Add track
  const addTrack = useCallback((track: AudioTrack) => {
    const newTracks = [...tracks, track];
    saveTracks(newTracks);
  }, [tracks, saveTracks]);

  // Remove track
  const removeTrack = useCallback((trackId: string) => {
    const newTracks = tracks.filter(t => t.id !== trackId);
    saveTracks(newTracks);
    
    // Also remove from playlists
    const newPlaylists = playlists.map(playlist => ({
      ...playlist,
      tracks: playlist.tracks.filter(id => id !== trackId),
    }));
    savePlaylists(newPlaylists);
  }, [tracks, playlists, saveTracks, savePlaylists]);

  // Update track
  const updateTrack = useCallback((trackId: string, updates: Partial<AudioTrack>) => {
    const newTracks = tracks.map(t => 
      t.id === trackId ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
    );
    saveTracks(newTracks);
  }, [tracks, saveTracks]);

  // Add playlist
  const addPlaylist = useCallback((playlist: Playlist) => {
    const newPlaylists = [...playlists, playlist];
    savePlaylists(newPlaylists);
  }, [playlists, savePlaylists]);

  // Remove playlist
  const removePlaylist = useCallback((playlistId: string) => {
    const newPlaylists = playlists.filter(p => p.id !== playlistId);
    savePlaylists(newPlaylists);
  }, [playlists, savePlaylists]);

  // Update playlist
  const updatePlaylist = useCallback((playlistId: string, updates: Partial<Playlist>) => {
    const newPlaylists = playlists.map(p => 
      p.id === playlistId ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
    );
    savePlaylists(newPlaylists);
  }, [playlists, savePlaylists]);

  // Filter tracks
  const getTracksByCategory = useCallback((category: string) => {
    return tracks.filter(track => track.category === category);
  }, [tracks]);

  const getTracksByMood = useCallback((mood: string) => {
    return tracks.filter(track => 
      track.mood?.toLowerCase().includes(mood.toLowerCase()) ||
      track.tags.some(tag => tag.toLowerCase().includes(mood.toLowerCase()))
    );
  }, [tracks]);

  const searchTracks = useCallback((query: string) => {
    const lowerQuery = query.toLowerCase();
    return tracks.filter(track =>
      track.title.toLowerCase().includes(lowerQuery) ||
      track.artist.toLowerCase().includes(lowerQuery) ||
      track.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }, [tracks]);

  // Initialize
  useEffect(() => {
    loadLibrary();
  }, [loadLibrary]);

  return {
    // Data
    tracks,
    playlists,
    isLoading,
    error,
    
    // Actions
    loadLibrary,
    addTrack,
    removeTrack,
    updateTrack,
    addPlaylist,
    removePlaylist,
    updatePlaylist,
    
    // Filters
    getTracksByCategory,
    getTracksByMood,
    searchTracks,
  };
}

/**
 * Hook for audio file upload
 */
export function useAudioUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadAudioFile = useCallback(async (file: File, metadata: Partial<AudioTrack>) => {
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      // Validate file type
      const validTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/flac'];
      if (!validTypes.includes(file.type)) {
        throw new AppError('Invalid audio file type', 'INVALID_INPUT');
      }

      // Create object URL for local storage
      const url = URL.createObjectURL(file);
      
      // Get audio duration
      const audio = new Audio(url);
      await new Promise((resolve, reject) => {
        audio.addEventListener('loadedmetadata', resolve);
        audio.addEventListener('error', reject);
      });

      const duration = audio.duration;
      URL.revokeObjectURL(url);

      // Create track object
      const track: AudioTrack = {
        id: `track-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: metadata.title || file.name.replace(/\.[^/.]+$/, ''),
        artist: metadata.artist || 'Unknown',
        category: metadata.category || 'music',
        duration,
        url: '', // Would be uploaded to server
        localPath: url,
        volume: metadata.volume || 0.7,
        loop: metadata.loop || false,
        tags: metadata.tags || [],
        mood: metadata.mood,
        license: metadata.license || 'Custom Upload',
        source: 'Custom Upload',
        isLocal: true,
        fileSize: file.size,
        mimeType: file.type,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      return track;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      throw err;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, []);

  return {
    isUploading,
    uploadProgress,
    error,
    uploadAudioFile,
  };
}

/**
 * Hook for keyboard shortcuts
 */
export function useAudioShortcuts() {
  const { play, pause, stop, next, previous, setVolume, setMasterVolume } = useAudioPlayer();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle shortcuts when not typing in input fields
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Check for modifier keys
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case ' ':
            e.preventDefault();
            if (audioService.getState().isPlaying) {
              pause();
            } else {
              play();
            }
            break;
          case 'ArrowRight':
            e.preventDefault();
            next();
            break;
          case 'ArrowLeft':
            e.preventDefault();
            previous();
            break;
          case 'ArrowUp':
            e.preventDefault();
            setMasterVolume(Math.min(1, audioService.getSettings().masterVolume + 0.1));
            break;
          case 'ArrowDown':
            e.preventDefault();
            setMasterVolume(Math.max(0, audioService.getSettings().masterVolume - 0.1));
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [play, pause, stop, next, previous, setVolume, setMasterVolume]);
}
