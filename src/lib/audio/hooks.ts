/**
 * Audio System React Hooks
 * React integration for the audio player service
 */

import { useState, useEffect, useCallback } from 'react';
import { audioService } from './audioService';
import type { AudioTrack, Playlist, AudioPlayerState, AudioSettings } from './types';
import { AppError } from '@/lib/appError';
import { logger } from '@/lib/logger';
import { saveAudioFile, deleteAudioFile } from './storage';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth/authContext';

type StoredAudioTrack = AudioTrack & { storagePath?: string };

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

  const loadPlaylist = useCallback((playlist: Playlist, tracks: AudioTrack[] = [], startIndex = 0) => {
    audioService.loadPlaylist(playlist, tracks, startIndex);
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
  const { user, loading } = useAuth();
  const isAuthed = isSupabaseConfigured && !!user?.id;
  const [tracks, setTracks] = useState<StoredAudioTrack[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load library data
  const loadLibrary = useCallback(async () => {
    if (loading) return;
    setIsLoading(true);
    setError(null);
    
    try {
      if (!isAuthed || !user?.id) {
        const savedTracks = localStorage.getItem('audio-tracks');
        const savedPlaylists = localStorage.getItem('audio-playlists');
        
        if (savedTracks) {
          try {
            setTracks(JSON.parse(savedTracks));
          } catch (parseError) {
            logger.warn('Failed to parse saved tracks:', parseError);
          }
        }
        
        if (savedPlaylists) {
          try {
            setPlaylists(JSON.parse(savedPlaylists));
          } catch (parseError) {
            logger.warn('Failed to parse saved playlists:', parseError);
          }
        }
        return;
      }

      const [tracksResult, playlistsResult] = await Promise.all([
        supabase
          .from('audio_tracks' as any)
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('audio_playlists' as any)
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
      ]);

      if (tracksResult.error) throw tracksResult.error;
      if (playlistsResult.error) throw playlistsResult.error;

      const mappedTracks = (tracksResult.data || []).map((row: any) => {
        let publicUrl = '';
        if (row.storage_path) {
          const { data: urlData } = supabase.storage
            .from('audio-tracks')
            .getPublicUrl(row.storage_path);
          publicUrl = urlData?.publicUrl ?? '';
        }

        return {
          id: row.id,
          title: row.title,
          artist: row.artist,
          category: row.category,
          duration: row.duration,
          url: publicUrl,
          volume: row.volume ?? 0.7,
          loop: row.loop ?? false,
          tags: Array.isArray(row.tags) ? row.tags : [],
          mood: row.mood ?? undefined,
          license: row.license ?? 'Custom Upload',
          source: row.source ?? 'Custom Upload',
          isLocal: false,
          fileSize: row.file_size ?? undefined,
          mimeType: row.mime_type ?? 'audio/mpeg',
          createdAt: row.created_at,
          updatedAt: row.updated_at,
          storagePath: row.storage_path,
        } as StoredAudioTrack;
      });

      const mappedPlaylists = (playlistsResult.data || []).map((row: any) => ({
        id: row.id,
        name: row.name,
        description: row.description ?? undefined,
        tracks: Array.isArray(row.tracks) ? row.tracks : [],
        category: row.category,
        autoPlay: row.auto_play ?? false,
        shuffle: row.shuffle ?? false,
        repeat: row.repeat ?? 'none',
        crossfade: row.crossfade ?? 2,
        volume: row.volume ?? 0.7,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      })) as Playlist[];

      setTracks(mappedTracks);
      setPlaylists(mappedPlaylists);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load library');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthed, loading, user?.id]);

  // Save tracks
  const saveTracks = useCallback((newTracks: AudioTrack[]) => {
    setTracks(newTracks);
    try {
      localStorage.setItem('audio-tracks', JSON.stringify(newTracks));
    } catch (error) {
      logger.error('Failed to save tracks:', error);
    }
  }, []);

  // Save playlists
  const savePlaylists = useCallback((newPlaylists: Playlist[]) => {
    setPlaylists(newPlaylists);
    try {
      localStorage.setItem('audio-playlists', JSON.stringify(newPlaylists));
    } catch (error) {
      logger.error('Failed to save playlists:', error);
    }
  }, []);

  // Add track
  const addTrack = useCallback((track: AudioTrack) => {
    if (!isAuthed || !user?.id) {
      const newTracks = [...tracks, track];
      saveTracks(newTracks);
      return;
    }
    setTracks((prev) => [...prev, track as StoredAudioTrack]);
  }, [isAuthed, saveTracks, tracks, user?.id]);

  // Remove track
  const removeTrack = useCallback(async (trackId: string) => {
    if (!isAuthed || !user?.id) {
      const newTracks = tracks.filter(t => t.id !== trackId);
      saveTracks(newTracks);
      
      // Also remove from playlists
      const newPlaylists = playlists.map(playlist => ({
        ...playlist,
        tracks: playlist.tracks.filter(id => id !== trackId),
      }));
      savePlaylists(newPlaylists);

      deleteAudioFile(trackId).catch((error) => {
        logger.warn('Failed to delete stored audio file:', error);
      });
      return;
    }

    const target = tracks.find((track) => track.id === trackId);
    const storagePath = target?.storagePath;
    const { error } = await supabase
      .from('audio_tracks' as any)
      .delete()
      .eq('id', trackId)
      .eq('user_id', user.id);
    if (error) {
      setError(error.message);
      return;
    }

    const playlistsWithTrack = playlists.filter((playlist) => playlist.tracks.includes(trackId));
    if (playlistsWithTrack.length > 0) {
      await Promise.all(
        playlistsWithTrack.map((playlist) =>
          supabase
            .from('audio_playlists' as any)
            .update({
              tracks: playlist.tracks.filter((id) => id !== trackId),
            })
            .eq('id', playlist.id)
            .eq('user_id', user.id)
        )
      );
    }

    setTracks((prev) => prev.filter((track) => track.id !== trackId));
    setPlaylists((prev) =>
      prev.map((playlist) => ({
        ...playlist,
        tracks: playlist.tracks.filter((id) => id !== trackId),
      }))
    );

    if (storagePath) {
      const { error: storageError } = await supabase.storage
        .from('audio-tracks')
        .remove([storagePath]);
      if (storageError) {
        logger.warn('Failed to delete audio file:', storageError);
      }
    }
  }, [isAuthed, playlists, savePlaylists, saveTracks, tracks, user?.id]);

  // Update track
  const updateTrack = useCallback(async (trackId: string, updates: Partial<AudioTrack>) => {
    if (!isAuthed || !user?.id) {
      const newTracks = tracks.map(t => 
        t.id === trackId ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
      );
      saveTracks(newTracks);
      return;
    }

    const { data, error } = await supabase
      .from('audio_tracks' as any)
      .update({
        title: updates.title,
        artist: updates.artist,
        category: updates.category,
        duration: updates.duration,
        volume: updates.volume,
        loop: updates.loop,
        tags: updates.tags,
        mood: updates.mood,
        license: updates.license,
        source: updates.source,
        file_size: updates.fileSize,
        mime_type: updates.mimeType,
      })
      .eq('id', trackId)
      .eq('user_id', user.id)
      .select('*')
      .single();
    if (error || !data) {
      setError(error?.message || 'Failed to update track');
      return;
    }

    setTracks((prev) =>
      prev.map((track) =>
        track.id === trackId
          ? {
              ...track,
              title: data.title,
              artist: data.artist,
              category: data.category,
              duration: data.duration,
              volume: data.volume ?? 0.7,
              loop: data.loop ?? false,
              tags: Array.isArray(data.tags) ? data.tags : [],
              mood: data.mood ?? undefined,
              license: data.license ?? 'Custom Upload',
              source: data.source ?? 'Custom Upload',
              fileSize: data.file_size ?? undefined,
              mimeType: data.mime_type ?? 'audio/mpeg',
              updatedAt: data.updated_at,
              storagePath: data.storage_path,
            }
          : track
      )
    );
  }, [isAuthed, saveTracks, tracks, user?.id]);

  // Add playlist
  const addPlaylist = useCallback(async (playlist: Playlist) => {
    if (!isAuthed || !user?.id) {
      const newPlaylists = [...playlists, playlist];
      savePlaylists(newPlaylists);
      return;
    }

    const { data, error } = await supabase
      .from('audio_playlists' as any)
      .insert({
        user_id: user.id,
        name: playlist.name,
        description: playlist.description,
        tracks: playlist.tracks,
        category: playlist.category,
        auto_play: playlist.autoPlay,
        shuffle: playlist.shuffle,
        repeat: playlist.repeat,
        crossfade: playlist.crossfade,
        volume: playlist.volume,
      })
      .select('*')
      .single();
    if (error || !data) {
      setError(error?.message || 'Failed to add playlist');
      return;
    }

    setPlaylists((prev) => [
      ...prev,
      {
        id: data.id,
        name: data.name,
        description: data.description ?? undefined,
        tracks: Array.isArray(data.tracks) ? data.tracks : [],
        category: data.category,
        autoPlay: data.auto_play ?? false,
        shuffle: data.shuffle ?? false,
        repeat: data.repeat ?? 'none',
        crossfade: data.crossfade ?? 2,
        volume: data.volume ?? 0.7,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      },
    ]);
  }, [isAuthed, playlists, savePlaylists, user?.id]);

  // Remove playlist
  const removePlaylist = useCallback(async (playlistId: string) => {
    if (!isAuthed || !user?.id) {
      const newPlaylists = playlists.filter(p => p.id !== playlistId);
      savePlaylists(newPlaylists);
      return;
    }

    const { error } = await supabase
      .from('audio_playlists' as any)
      .delete()
      .eq('id', playlistId)
      .eq('user_id', user.id);
    if (error) {
      setError(error.message);
      return;
    }
    setPlaylists((prev) => prev.filter((playlist) => playlist.id !== playlistId));
  }, [isAuthed, playlists, savePlaylists, user?.id]);

  // Update playlist
  const updatePlaylist = useCallback(async (playlistId: string, updates: Partial<Playlist>) => {
    if (!isAuthed || !user?.id) {
      const newPlaylists = playlists.map(p => 
        p.id === playlistId ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      );
      savePlaylists(newPlaylists);
      return;
    }

    const { data, error } = await supabase
      .from('audio_playlists' as any)
      .update({
        name: updates.name,
        description: updates.description,
        tracks: updates.tracks,
        category: updates.category,
        auto_play: updates.autoPlay,
        shuffle: updates.shuffle,
        repeat: updates.repeat,
        crossfade: updates.crossfade,
        volume: updates.volume,
      })
      .eq('id', playlistId)
      .eq('user_id', user.id)
      .select('*')
      .single();
    if (error || !data) {
      setError(error?.message || 'Failed to update playlist');
      return;
    }

    setPlaylists((prev) =>
      prev.map((playlist) =>
        playlist.id === playlistId
          ? {
              id: data.id,
              name: data.name,
              description: data.description ?? undefined,
              tracks: Array.isArray(data.tracks) ? data.tracks : [],
              category: data.category,
              autoPlay: data.auto_play ?? false,
              shuffle: data.shuffle ?? false,
              repeat: data.repeat ?? 'none',
              crossfade: data.crossfade ?? 2,
              volume: data.volume ?? 0.7,
              createdAt: data.created_at,
              updatedAt: data.updated_at,
            }
          : playlist
      )
    );
  }, [isAuthed, playlists, savePlaylists, user?.id]);

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
  const { user, loading } = useAuth();
  const isAuthed = isSupabaseConfigured && !!user?.id;

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

      // Create object URL for duration analysis
      const url = URL.createObjectURL(file);
      
      // Get audio duration
      const audio = new Audio(url);
      await new Promise((resolve, reject) => {
        audio.addEventListener('loadedmetadata', resolve);
        audio.addEventListener('error', reject);
      });

      const duration = audio.duration;
      URL.revokeObjectURL(url);

      const trackId = typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `track-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

      if (!isAuthed || !user?.id || loading) {
        await saveAudioFile(trackId, file);

        // Create track object
        const track: AudioTrack = {
          id: trackId,
          title: metadata.title || file.name.replace(/\.[^/.]+$/, ''),
          artist: metadata.artist || 'Unknown',
          category: metadata.category || 'music',
          duration,
          url: '',
          localPath: `audio-db:${trackId}`,
          volume: metadata.volume || 0.7,
          loop: metadata.loop || false,
          tags: metadata.tags || [],
          mood: metadata.mood,
          license: metadata.license || 'Custom Upload',
          source: metadata.source || 'Custom Upload',
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
      }

      setUploadProgress(20);
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'mp3';
      const storagePath = `${user.id}/${trackId}.${fileExtension}`;

      const { error: uploadError } = await supabase.storage
        .from('audio-tracks')
        .upload(storagePath, file, {
          contentType: file.type,
          upsert: false,
        });
      if (uploadError) {
        throw uploadError;
      }

      setUploadProgress(70);
      const { data: publicData } = supabase.storage
        .from('audio-tracks')
        .getPublicUrl(storagePath);

      const { data, error: insertError } = await supabase
        .from('audio_tracks' as any)
        .insert({
          user_id: user.id,
          title: metadata.title || file.name.replace(/\.[^/.]+$/, ''),
          artist: metadata.artist || 'Unknown',
          category: metadata.category || 'music',
          duration,
          storage_path: storagePath,
          volume: metadata.volume || 0.7,
          loop: metadata.loop || false,
          tags: metadata.tags || [],
          mood: metadata.mood,
          license: metadata.license || 'Custom Upload',
          source: metadata.source || 'Custom Upload',
          file_size: file.size,
          mime_type: file.type,
        })
        .select('*')
        .single();
      if (insertError || !data) {
        throw insertError || new Error('Failed to save audio metadata');
      }

      setUploadProgress(100);
      const track: StoredAudioTrack = {
        id: data.id,
        title: data.title,
        artist: data.artist,
        category: data.category,
        duration: data.duration,
        url: publicData?.publicUrl || '',
        volume: data.volume ?? 0.7,
        loop: data.loop ?? false,
        tags: Array.isArray(data.tags) ? data.tags : [],
        mood: data.mood ?? undefined,
        license: data.license ?? 'Custom Upload',
        source: data.source ?? 'Custom Upload',
        isLocal: false,
        fileSize: data.file_size ?? undefined,
        mimeType: data.mime_type ?? file.type,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        storagePath: data.storage_path,
      };

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

