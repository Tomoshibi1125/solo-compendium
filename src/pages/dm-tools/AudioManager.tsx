import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AudioPlayer } from '@/components/audio/AudioPlayer';
import { AudioLibrary } from '@/components/audio/AudioLibrary';
import { AIEnhancedAudio } from '@/components/audio/AIEnhancedAudio';
import { Layout } from '@/components/layout/Layout';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Music, Volume2, Settings, PlayCircle, Sparkles } from 'lucide-react';
import { useAudioLibrary, useAudioPlayer } from '@/lib/audio/hooks';
import { useToast } from '@/hooks/use-toast';
import type { AudioTrack, Playlist } from '@/lib/audio/types';

export default function AudioManagerDM() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('player');

  const { tracks, getTracksByCategory, getTracksByMood } = useAudioLibrary();
  const { loadTrack, play, loadPlaylist, repeat, shuffle, setRepeat, setShuffle, updateSettings, settings } = useAudioPlayer();

  const handleTrackSelect = async (track: AudioTrack) => {
    try {
      await loadTrack(track);
      await play();
    } catch (error) {
      toast({
        title: 'Playback failed',
        description: error instanceof Error ? error.message : 'Unable to play track.',
        variant: 'destructive',
      });
    }
  };

  const playPlaylist = async (name: string, category: Playlist['category'], list: AudioTrack[]) => {
    if (list.length === 0) {
      toast({
        title: 'No tracks available',
        description: 'Upload audio for this playlist first.',
        variant: 'destructive',
      });
      return;
    }

    const now = new Date().toISOString();
    const playlist: Playlist = {
      id: `playlist-${category}-${Date.now()}`,
      name,
      tracks: list.map((track) => track.id),
      category,
      autoPlay: true,
      shuffle: false,
      repeat: 'all',
      crossfade: 2,
      volume: 0.7,
      createdAt: now,
      updatedAt: now,
    };

    loadPlaylist(playlist, list, 0);
    await play();
  };

  const playEffect = async (label: string, matcher: (track: AudioTrack) => boolean) => {
    const effectTracks = getTracksByCategory('effect').filter(matcher);
    if (effectTracks.length === 0) {
      toast({
        title: 'No effects found',
        description: `Add a sound effect tagged for ${label.toLowerCase()} first.`,
        variant: 'destructive',
      });
      return;
    }

    await handleTrackSelect(effectTracks[0]);
  };

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
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
                <Sparkles className="w-5 h-5 text-orange-500" />
                <div>
                  <div className="text-2xl font-bold">AI Analysis</div>
                  <p className="text-sm text-muted-foreground">Tag and categorize audio</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
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
            <TabsTrigger value="ai" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              AI
            </TabsTrigger>
          </TabsList>

          <TabsContent value="player" className="space-y-4">
            <AudioPlayer />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Playlists</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => playPlaylist('Combat Music', 'combat', getTracksByCategory('combat'))}
                  >
                    <Music className="w-4 h-4 mr-2" />
                    Combat Music
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => playPlaylist('Ambient Atmosphere', 'custom', getTracksByMood('calm'))}
                  >
                    <Music className="w-4 h-4 mr-2" />
                    Ambient Atmosphere
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => playPlaylist('Dungeon Exploration', 'exploration', getTracksByCategory('exploration'))}
                  >
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
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => playEffect('Sword Clashes', (track) => track.title.toLowerCase().includes('sword') || track.tags.some((tag) => tag.toLowerCase().includes('sword')))}
                  >
                    <Volume2 className="w-4 h-4 mr-2" />
                    Sword Clashes
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => playEffect('Magic Spells', (track) => track.title.toLowerCase().includes('magic') || track.tags.some((tag) => tag.toLowerCase().includes('magic')))}
                  >
                    <Volume2 className="w-4 h-4 mr-2" />
                    Magic Spells
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => playEffect('Monster Roars', (track) => track.title.toLowerCase().includes('monster') || track.tags.some((tag) => tag.toLowerCase().includes('monster')))}
                  >
                    <Volume2 className="w-4 h-4 mr-2" />
                    Monster Roars
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="library" className="space-y-4">
            <AudioLibrary onTrackSelect={handleTrackSelect} />
          </TabsContent>

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
                    variant={settings.crossfadeDuration > 0 ? 'default' : 'outline'}
                    onClick={() => updateSettings({ crossfadeDuration: settings.crossfadeDuration > 0 ? 0 : 2 })}
                  >
                    {settings.crossfadeDuration > 0 ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Loop Playlist</h4>
                    <p className="text-sm text-muted-foreground">Repeat tracks automatically</p>
                  </div>
                  <Button
                    variant={repeat === 'all' ? 'default' : 'outline'}
                    onClick={() => setRepeat(repeat === 'all' ? 'none' : 'all')}
                  >
                    {repeat === 'all' ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Shuffle</h4>
                    <p className="text-sm text-muted-foreground">Random track order</p>
                  </div>
                  <Button
                    variant={shuffle ? 'default' : 'outline'}
                    onClick={() => setShuffle(!shuffle)}
                  >
                    {shuffle ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai" className="space-y-4">
            <AIEnhancedAudio />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
