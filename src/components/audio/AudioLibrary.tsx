import { useState, useMemo } from 'react';
import { Upload, Music, Filter, Search, Plus, Trash2, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAudioLibrary, useAudioUpload } from '@/lib/audio/hooks';
import { formatDuration } from '@/lib/audio/types';
import { useToast } from '@/hooks/use-toast';
import type { AudioTrack } from '@/lib/audio/types';
import './AudioLibrary.css';

interface AudioLibraryProps {
  onTrackSelect?: (track: AudioTrack) => void;
}

export function AudioLibrary({ onTrackSelect }: AudioLibraryProps) {
  const { toast } = useToast();
  const { tracks, addTrack, removeTrack, isLoading } = useAudioLibrary();
  const { uploadAudioFile, isUploading, uploadProgress } = useAudioUpload();

  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedMood, setSelectedMood] = useState('all');
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [uploadMetadata, setUploadMetadata] = useState({
    title: '',
    artist: '',
    category: 'music',
    mood: '',
    tags: '',
    license: 'Custom',
  });

  const filteredTracks = useMemo(() => {
    return tracks.filter((track) => {
      const matchesSearch = track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesGenre = selectedGenre === 'all' || track.category === selectedGenre;
      const matchesMood = selectedMood === 'all' ||
        track.mood?.toLowerCase().includes(selectedMood.toLowerCase()) ||
        track.tags.some((tag) => tag.toLowerCase().includes(selectedMood.toLowerCase()));
      return matchesSearch && matchesGenre && matchesMood;
    });
  }, [tracks, searchQuery, selectedGenre, selectedMood]);

  const totalDuration = filteredTracks.reduce((sum, track) => sum + (track.duration || 0), 0);
  const totalSize = filteredTracks.reduce((sum, track) => sum + (track.fileSize || 0), 0);
  const lastUpdated = filteredTracks
    .map((track) => track.updatedAt)
    .filter(Boolean)
    .sort()
    .slice(-1)[0];

  const handleUpload = async () => {
    if (!pendingFile) return;

    try {
      const track = await uploadAudioFile(pendingFile, {
        title: uploadMetadata.title || pendingFile.name.replace(/\.[^/.]+$/, ''),
        artist: uploadMetadata.artist || 'Unknown',
        category: uploadMetadata.category as AudioTrack['category'],
        mood: uploadMetadata.mood || undefined,
        tags: uploadMetadata.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
        license: uploadMetadata.license,
      });

      addTrack(track);
      setPendingFile(null);
      setUploadMetadata({
        title: '',
        artist: '',
        category: 'music',
        mood: '',
        tags: '',
        license: 'Custom',
      });
      setIsUploadDialogOpen(false);
      toast({
        title: 'Audio uploaded',
        description: `Added "${track.title}" to your library.`,
      });
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Unable to upload audio file.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-muted-foreground">Legal-safe sounds and music for your campaigns</h2>
          <p className="text-muted-foreground">Browse and manage your audio library</p>
        </div>
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Upload Audio
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Audio</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                type="file"
                accept="audio/*"
                onChange={(e) => setPendingFile(e.target.files?.[0] ?? null)}
                disabled={isUploading}
                aria-label="Upload audio file"
              />
              <Input
                placeholder="Title"
                value={uploadMetadata.title}
                onChange={(e) => setUploadMetadata((prev) => ({ ...prev, title: e.target.value }))}
              />
              <Input
                placeholder="Artist"
                value={uploadMetadata.artist}
                onChange={(e) => setUploadMetadata((prev) => ({ ...prev, artist: e.target.value }))}
              />
              <Select
                value={uploadMetadata.category}
                onValueChange={(value) => setUploadMetadata((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="music">Music</SelectItem>
                  <SelectItem value="ambient">Ambient</SelectItem>
                  <SelectItem value="effect">Effect</SelectItem>
                  <SelectItem value="combat">Combat</SelectItem>
                  <SelectItem value="exploration">Exploration</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="horror">Horror</SelectItem>
                  <SelectItem value="mystery">Mystery</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Mood (optional)"
                value={uploadMetadata.mood}
                onChange={(e) => setUploadMetadata((prev) => ({ ...prev, mood: e.target.value }))}
              />
              <Input
                placeholder="Tags (comma separated)"
                value={uploadMetadata.tags}
                onChange={(e) => setUploadMetadata((prev) => ({ ...prev, tags: e.target.value }))}
              />
              {isUploading && (
                <div className="w-full bg-primary h-2 rounded-full transition-all">
                  <div
                    className="bg-primary-foreground h-2 rounded-full transition-all upload-progress-bar"
                    style={{ '--progress-width': `${uploadProgress}%` } as React.CSSProperties}
                  />
                </div>
              )}
              <Button className="w-full" onClick={handleUpload} disabled={!pendingFile || isUploading}>
                {isUploading ? 'Uploading...' : 'Save to Library'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tracks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                aria-label="Search audio tracks"
              />
            </div>
            <Select value={selectedGenre} onValueChange={setSelectedGenre}>
              <SelectTrigger>
                <SelectValue placeholder="Select genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genres</SelectItem>
                <SelectItem value="music">Music</SelectItem>
                <SelectItem value="ambient">Ambient</SelectItem>
                <SelectItem value="effect">Effect</SelectItem>
                <SelectItem value="combat">Combat</SelectItem>
                <SelectItem value="exploration">Exploration</SelectItem>
                <SelectItem value="social">Social</SelectItem>
                <SelectItem value="horror">Horror</SelectItem>
                <SelectItem value="mystery">Mystery</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedMood} onValueChange={setSelectedMood}>
              <SelectTrigger>
                <SelectValue placeholder="Select mood" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Moods</SelectItem>
                <SelectItem value="epic">Epic</SelectItem>
                <SelectItem value="calm">Calm</SelectItem>
                <SelectItem value="tense">Tense</SelectItem>
                <SelectItem value="mysterious">Mysterious</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
        <div className="text-center">
          <div className="text-2xl font-bold">{filteredTracks.length}</div>
          <div className="text-sm text-muted-foreground">Total Tracks</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{formatDuration(totalDuration)}</div>
          <div className="text-sm text-muted-foreground">Total Duration</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{(totalSize / (1024 * 1024)).toFixed(1)}MB</div>
          <div className="text-sm text-muted-foreground">Library Size</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{lastUpdated ? new Date(lastUpdated).toLocaleDateString() : 'N/A'}</div>
          <div className="text-sm text-muted-foreground">Last Updated</div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="w-4 h-4" />
            Audio Tracks
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="text-sm text-muted-foreground">Loading audio library...</div>
          )}
          {!isLoading && filteredTracks.length === 0 && (
            <div className="text-sm text-muted-foreground">No tracks match your filters yet.</div>
          )}
          <div className="space-y-2">
            {filteredTracks.map((track) => (
              <div
                key={track.id}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent"
              >
                <div>
                  <h4 className="font-semibold">{track.title}</h4>
                  <p className="text-sm text-muted-foreground">{track.artist}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{track.category}</Badge>
                  {track.mood && <Badge variant="outline">{track.mood}</Badge>}
                  <span className="text-sm text-muted-foreground">
                    {formatDuration(track.duration)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onTrackSelect?.(track)}
                    aria-label={`Play ${track.title}`}
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeTrack(track.id)}
                    aria-label={`Remove ${track.title}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
