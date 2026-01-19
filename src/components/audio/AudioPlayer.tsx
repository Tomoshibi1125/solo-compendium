import { Play, Pause, SkipForward, SkipBack, Volume2, Music, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { useAudioPlayer } from '@/lib/audio/hooks';
import { formatDuration } from '@/lib/audio/types';

export function AudioPlayer() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    settings,
    play,
    pause,
    next,
    previous,
    setCurrentTime,
    setMasterVolume,
  } = useAudioPlayer();

  const handleSeek = (value: number[]) => {
    setCurrentTime(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    setMasterVolume(value[0]);
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
        {currentTrack ? (
          <div className="text-center">
            <h3 className="font-semibold">{currentTrack.title}</h3>
            <p className="text-sm text-muted-foreground">{currentTrack.artist}</p>
          </div>
        ) : (
          <div className="text-center text-sm text-muted-foreground">
            No track loaded yet.
          </div>
        )}

        <div className="space-y-2">
          <Slider
            value={[currentTime]}
            max={duration || 1}
            step={1}
            onValueChange={handleSeek}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatDuration(currentTime)}</span>
            <span>{formatDuration(duration)}</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2">
          <Button variant="ghost" size="sm" onClick={previous} disabled={!currentTrack}>
            <SkipBack className="w-4 h-4" />
          </Button>

          <Button variant="default" size="sm" onClick={isPlaying ? pause : play} disabled={!currentTrack}>
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </Button>

          <Button variant="ghost" size="sm" onClick={next} disabled={!currentTrack}>
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4" />
          <Slider
            value={[settings.masterVolume]}
            max={1}
            step={0.05}
            onValueChange={handleVolumeChange}
            className="flex-1"
          />
          <Badge variant="outline" className="text-xs">
            {Math.round(settings.masterVolume * 100)}%
          </Badge>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>{isPlaying ? 'Playing' : 'Paused'}</span>
        </div>
      </CardContent>
    </Card>
  );
}
