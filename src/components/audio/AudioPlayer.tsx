import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

interface AudioPlayerProps {
  tracks?: Array<{
    id: string;
    title: string;
    artist: string;
    duration: number;
    url: string;
  }>;
}

export function AudioPlayer({ tracks = [] }: AudioPlayerProps) {
  const [state, setState] = useState({
    currentTrack: null as any,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.7,
    isMuted: false,
  });

  const audioRef = useRef<HTMLAudioElement>(null);

  const play = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setState(prev => ({ ...prev, isPlaying: true }));
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setState(prev => ({ ...prev, isPlaying: false }));
    }
  };

  const next = () => {
    // Logic to play next track
    console.log('Next track');
  };

  const previous = () => {
    // Logic to play previous track
    console.log('Previous track');
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setState(prev => ({
        ...prev,
        currentTime: audioRef.current.currentTime,
        duration: audioRef.current.duration || 0,
      }));
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setState(prev => ({ ...prev, currentTime: value[0] }));
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setState(prev => ({ ...prev, volume: value[0] }));
    if (audioRef.current) {
      audioRef.current.volume = value[0];
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="w-4 h-4" />
          Audio Player
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Track Info */}
        {state.currentTrack && (
          <div className="text-center">
            <h3 className="font-semibold">{state.currentTrack.title}</h3>
            <p className="text-sm text-muted-foreground">{state.currentTrack.artist}</p>
          </div>
        )}

        {/* Progress Bar */}
        <div className="space-y-2">
          <Slider
            value={[state.currentTime]}
            max={state.duration}
            step={1}
            onValueChange={handleSeek}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(state.currentTime)}</span>
            <span>{formatTime(state.duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-2">
          <Button variant="ghost" size="sm" onClick={previous}>
            <SkipBack className="w-4 h-4" />
          </Button>
          
          <Button variant="default" size="sm" onClick={state.isPlaying ? pause : play}>
            {state.isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </Button>
          
          <Button variant="ghost" size="sm" onClick={next}>
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4" />
          <Slider
            value={[state.volume]}
            max={1}
            step={0.1}
            onValueChange={handleVolumeChange}
            className="flex-1"
          />
          <Badge variant="outline" className="text-xs">
            {Math.round(state.volume * 100)}%
          </Badge>
        </div>

        {/* Status */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>{state.isPlaying ? 'Playing' : 'Paused'}</span>
        </div>

        {/* Hidden Audio Element */}
        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleTimeUpdate}
          src={state.currentTrack?.url}
        />
      </CardContent>
    </Card>
  );
}