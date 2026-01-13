/**
 * DM Tools Audio Manager
 * Complete audio management system for DMs
 */

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AudioPlayer } from '@/components/audio/AudioPlayer';
import { AudioLibrary } from '@/components/audio/AudioLibrary';
import { Layout } from '@/components/layout/Layout';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Music, Volume2, Settings, PlayCircle } from 'lucide-react';
import { error } from '@/lib/logger';

export default function AudioManagerDM() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('player');
  
  // Complete audio management system
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playlist, setPlaylist] = useState<AudioTrack[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  
  interface AudioTrack {
    id: string;
    name: string;
    url: string;
    duration?: number;
  }
  
  const handlePlay = () => {
    if (audioRef.current) {
      try {
        audioRef.current.play();
      } catch (error) {
        error("Error playing audio:", error);
      }
      setIsPlaying(true);
    }
  };
  
  const handlePause = () => {
    if (audioRef.current) {
      try {
        audioRef.current.pause();
      } catch (error) {
        error("Error pausing audio:", error);
      }
      setIsPlaying(false);
    }
  };
  
  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };
  
  const handleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };
  
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };
  
  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };
  
  const playNext = () => {
    const nextIndex = (currentTrackIndex + 1) % playlist.length;
    setCurrentTrackIndex(nextIndex);
  };
  
  const playPrevious = () => {
    const prevIndex = currentTrackIndex === 0 ? playlist.length - 1 : currentTrackIndex - 1;
    setCurrentTrackIndex(prevIndex);
  };
  
  // Playlist management
  const addToPlaylist = (track: AudioTrack) => {
    setPlaylist([...playlist, track]);
  };
  
  const removeFromPlaylist = (trackId: string) => {
    setPlaylist(playlist.filter(track => track.id !== trackId));
  };
  
  const clearPlaylist = () => {
    setPlaylist([]);
    setCurrentTrackIndex(0);
  };
  
  // Audio effects
  const [crossfadeEnabled, setCrossfadeEnabled] = useState(false);
  const [loopEnabled, setLoopEnabled] = useState(false);
  const [shuffleEnabled, setShuffleEnabled] = useState(false);

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/dm-tools')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to DM Tools
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">Audio Manager</h1>
            <p className="text-muted-foreground">Legal-safe sounds and music for your campaigns</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold">Audio Library</div>
                  <p className="text-sm text-muted-foreground">Manage your sound collection</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <PlayCircle className="w-5 h-5 text-green-500" />
                <div>
                  <div className="text-2xl font-bold">Player</div>
                  <p className="text-sm text-muted-foreground">Control playback</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-purple-500" />
                <div>
                  <div className="text-2xl font-bold">Settings</div>
                  <p className="text-sm text-muted-foreground">Audio preferences</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-orange-500" />
                <div>
                  <div className="text-2xl font-bold">Legal Safe</div>
                  <p className="text-sm text-muted-foreground">Royalty-free content</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="player" className="flex items-center gap-2">
              <PlayCircle className="w-4 h-4" />
              Player
            </TabsTrigger>
            <TabsTrigger value="library" className="flex items-center gap-2">
              <Music className="w-4 h-4" />
              Library
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Player Tab */}
          <TabsContent value="player" className="space-y-4">
            <AudioPlayer />
            
            {/* Quick Access */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Playlists</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Music className="w-4 h-4 mr-2" />
                    Combat Music
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Music className="w-4 h-4 mr-2" />
                    Ambient Atmosphere
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Music className="w-4 h-4 mr-2" />
                    Dungeon Exploration
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Sound Effects</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Volume2 className="w-4 h-4 mr-2" />
                    Sword Clashes
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Volume2 className="w-4 h-4 mr-2" />
                    Magic Spells
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Volume2 className="w-4 h-4 mr-2" />
                    Monster Roars
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Library Tab */}
          <TabsContent value="library" className="space-y-4">
            <AudioLibrary />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Audio Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Crossfade</h4>
                    <p className="text-sm text-muted-foreground">Smooth transitions between tracks</p>
                  </div>
                  <Button
                    variant={crossfadeEnabled ? "default" : "outline"}
                    onClick={() => setCrossfadeEnabled(!crossfadeEnabled)}
                  >
                    {crossfadeEnabled ? "Enabled" : "Disabled"}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Loop Playlist</h4>
                    <p className="text-sm text-muted-foreground">Repeat tracks automatically</p>
                  </div>
                  <Button
                    variant={loopEnabled ? "default" : "outline"}
                    onClick={() => setLoopEnabled(!loopEnabled)}
                  >
                    {loopEnabled ? "Enabled" : "Disabled"}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Shuffle</h4>
                    <p className="text-sm text-muted-foreground">Random track order</p>
                  </div>
                  <Button
                    variant={shuffleEnabled ? "default" : "outline"}
                    onClick={() => setShuffleEnabled(!shuffleEnabled)}
                  >
                    {shuffleEnabled ? "Enabled" : "Disabled"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
